from __future__ import annotations

import threading
import time
from collections import deque
from pathlib import Path

from kivy.app import App
from kivy.clock import Clock
from kivy.lang import Builder
from kivy.properties import BooleanProperty, NumericProperty, StringProperty
from kivy.uix.screenmanager import Screen, ScreenManager

from analysis.correlation import CorrelationEngine
from bluetooth.spp_client import SPPClient
from parsing.csv_protocol import PacketParser, ParsedPacket
from gut_signal.egg_processing import EGGProcessor
from gut_signal.posture_processing import PostureProcessor
from storage.session_store import SessionStore


KV_PATH = Path(__file__).parent / "ui" / "main.kv"


class ConnectScreen(Screen):
    status_text = StringProperty("Disconnected")
    connection_indicator = StringProperty("OFFLINE")
    session_status_text = StringProperty("Session: Idle")
    rx_count = NumericProperty(0)
    invalid_count = NumericProperty(0)


class DashboardScreen(Screen):
    posture_score = NumericProperty(0.0)
    posture_tilt_deg = NumericProperty(0.0)
    egg_rms = NumericProperty(0.0)
    egg_mean_uv = NumericProperty(0.0)
    corr_value = NumericProperty(0.0)
    alert_text = StringProperty("No alerts")
    alert_level = StringProperty("INFO")
    alert_count = NumericProperty(0)


class SessionScreen(Screen):
    summary_text = StringProperty("No session yet")
    active_text = StringProperty("Idle")
    sample_count = NumericProperty(0)
    duration_s = NumericProperty(0.0)
    pearson_text = StringProperty("0.0000")
    export_text = StringProperty("No export yet")


class GutAngleManager(ScreenManager):
    pass


class GutAngleApp(App):
    title = "GutAngle"

    def build(self):
        Builder.load_file(str(KV_PATH))
        self.spp = SPPClient()
        self.parser = PacketParser()
        self.egg = EGGProcessor(sample_rate_hz=25.0)
        self.posture = PostureProcessor()
        self.correlation = CorrelationEngine(window_size=250)
        self.store = SessionStore()
        self._rx_thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._queue: deque[ParsedPacket] = deque(maxlen=1000)
        self._invalid_count = 0
        self._sample_count = 0
        self._session_active = False
        self._session_started_at_monotonic: float | None = None
        self._alert_count = 0

        self.manager = GutAngleManager()
        Clock.schedule_interval(self._drain_queue, 1.0 / 15.0)
        Clock.schedule_interval(self._refresh_session_panel, 1.0)
        return self.manager

    def on_stop(self):
        self.disconnect_device()

    def connect_device(self, address: str, channel: int = 1) -> bool:
        if self.spp.is_connected:
            return True
        ok = self.spp.connect(address=address, channel=channel)
        connect_screen = self.manager.get_screen("connect")
        if not ok:
            connect_screen.status_text = "Connection failed"
            connect_screen.connection_indicator = "OFFLINE"
            return False
        connect_screen.status_text = "Connected"
        connect_screen.connection_indicator = "ONLINE"
        self._stop_event.clear()
        self._rx_thread = threading.Thread(target=self._rx_loop, daemon=True)
        self._rx_thread.start()
        return True

    def disconnect_device(self):
        self._stop_event.set()
        if self._rx_thread and self._rx_thread.is_alive():
            self._rx_thread.join(timeout=1.5)
        self.spp.disconnect()
        if hasattr(self, "manager"):
            connect_screen = self.manager.get_screen("connect")
            connect_screen.status_text = "Disconnected"
            connect_screen.connection_indicator = "OFFLINE"

    def start_session(self):
        self.store.start_session()
        self._sample_count = 0
        self._invalid_count = 0
        self._alert_count = 0
        self._session_active = True
        self._session_started_at_monotonic = time.monotonic()
        self.correlation.reset()
        self.egg.reset()
        self.posture.reset()
        connect_screen = self.manager.get_screen("connect")
        connect_screen.session_status_text = "Session: Running"
        session_screen = self.manager.get_screen("session")
        session_screen.active_text = "Recording"
        session_screen.export_text = "No export yet"
        session_screen.summary_text = "Session running..."
        dashboard = self.manager.get_screen("dashboard")
        dashboard.alert_count = 0
        dashboard.alert_level = "INFO"
        dashboard.alert_text = "No alerts"

    def stop_session(self):
        self.store.stop_session()
        self._session_active = False
        self._session_started_at_monotonic = None
        self.manager.get_screen("connect").session_status_text = "Session: Stopped"
        metrics = self.store.compute_summary()
        session_screen = self.manager.get_screen("session")
        session_screen.active_text = "Stopped"
        session_screen.sample_count = metrics.samples
        session_screen.duration_s = metrics.duration_s
        session_screen.pearson_text = f"{metrics.pearson_corr:.4f}"
        session_screen.summary_text = (
            f"Samples: {metrics.samples}\n"
            f"Duration(s): {metrics.duration_s:.2f}\n"
            f"Pearson: {metrics.pearson_corr:.4f}"
        )

    def export_session(self):
        path = self.store.export_csv()
        session_screen = self.manager.get_screen("session")
        session_screen.export_text = str(path)
        session_screen.summary_text += f"\nExport: {path}"

    def _rx_loop(self):
        for line in self.spp.read_lines(stop_event=self._stop_event):
            packet = self.parser.parse_line(line)
            if packet is None:
                self._invalid_count += 1
                continue
            self._queue.append(packet)
            self._sample_count += 1

    def _drain_queue(self, _dt: float):
        connect_screen = self.manager.get_screen("connect")
        dash = self.manager.get_screen("dashboard")
        connect_screen.rx_count = self._sample_count
        connect_screen.invalid_count = self._invalid_count

        while self._queue:
            packet = self._queue.popleft()
            egg_features = self.egg.update(packet.timestamp_ms, packet.egg_ch1_uv, packet.egg_ch2_uv)
            posture_features = self.posture.update(packet.timestamp_ms, packet.acc_x, packet.acc_y, packet.acc_z)
            corr = self.correlation.update(posture_features.alignment_score, egg_features.rms)
            self.store.append(packet, posture_features, egg_features, corr)

            dash.posture_score = posture_features.alignment_score
            dash.posture_tilt_deg = posture_features.tilt_deg
            dash.egg_rms = egg_features.rms
            dash.egg_mean_uv = egg_features.mean_uv
            dash.corr_value = corr.rolling_pearson
            self._update_alert_state(
                posture_score=posture_features.alignment_score,
                egg_rms=egg_features.rms,
                rolling_corr=corr.rolling_pearson,
            )

    def _refresh_session_panel(self, _dt: float):
        if not hasattr(self, "manager"):
            return
        session_screen = self.manager.get_screen("session")
        session_screen.sample_count = self._sample_count
        if self._session_active and self._session_started_at_monotonic is not None:
            session_screen.duration_s = max(0.0, time.monotonic() - self._session_started_at_monotonic)
            session_screen.active_text = "Recording"
            return
        session_screen.active_text = "Idle" if self._sample_count == 0 else "Stopped"

    def _update_alert_state(self, posture_score: float, egg_rms: float, rolling_corr: float) -> None:
        dashboard = self.manager.get_screen("dashboard")
        alert_level = "INFO"
        alert_text = "No alerts"

        if posture_score < 35.0:
            alert_level = "HIGH"
            alert_text = "Poor posture: severe tilt detected"
        elif posture_score < 50.0:
            alert_level = "MEDIUM"
            alert_text = "Posture drift: adjust sitting position"
        elif egg_rms > self.egg.alert_rms_threshold * 1.4:
            alert_level = "HIGH"
            alert_text = "High EGG burst detected"
        elif egg_rms > self.egg.alert_rms_threshold:
            alert_level = "MEDIUM"
            alert_text = "EGG activity above threshold"
        elif abs(rolling_corr) > 0.75:
            alert_level = "LOW"
            alert_text = "Strong posture/EGG coupling"

        if alert_level != "INFO":
            self._alert_count += 1
        dashboard.alert_count = self._alert_count
        dashboard.alert_level = alert_level
        dashboard.alert_text = alert_text


if __name__ == "__main__":
    GutAngleApp().run()
