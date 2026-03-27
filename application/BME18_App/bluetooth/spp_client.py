from __future__ import annotations

import time
from typing import Generator, Optional


class SPPClient:
    """
    Bluetooth Classic SPP client.

    On Android, pyjnius can be used to map to android.bluetooth APIs.
    For desktop testing, this class supports a mock stream fallback.
    """

    def __init__(self) -> None:
        self._connected = False
        self._mock_mode = False
        self._socket = None
        self._stream = None

    @property
    def is_connected(self) -> bool:
        return self._connected

    def connect(self, address: str, channel: int = 1) -> bool:
        # Android path: use pyjnius if available.
        try:
            from jnius import autoclass  # type: ignore

            UUID = autoclass("java.util.UUID")
            BluetoothAdapter = autoclass("android.bluetooth.BluetoothAdapter")
            adapter = BluetoothAdapter.getDefaultAdapter()
            if adapter is None:
                return False
            if not adapter.isEnabled():
                return False
            device = adapter.getRemoteDevice(address)
            spp_uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
            sock = device.createRfcommSocketToServiceRecord(spp_uuid)
            sock.connect()
            self._socket = sock
            self._stream = sock.getInputStream()
            self._connected = True
            self._mock_mode = False
            return True
        except Exception:
            # Desktop fallback for development.
            self._connected = True
            self._mock_mode = True
            return True

    def disconnect(self) -> None:
        if self._socket is not None:
            try:
                self._socket.close()
            except Exception:
                pass
        self._socket = None
        self._stream = None
        self._connected = False

    def read_lines(self, stop_event) -> Generator[str, None, None]:
        if not self._connected:
            return
        if self._mock_mode:
            yield from self._read_mock_lines(stop_event)
            return
        yield from self._read_android_lines(stop_event)

    def _read_android_lines(self, stop_event) -> Generator[str, None, None]:
        if self._stream is None:
            return
        buf = []
        while not stop_event.is_set():
            b = self._stream.read()
            if b == -1:
                time.sleep(0.02)
                continue
            c = chr(b)
            if c == "\n":
                line = "".join(buf).strip()
                buf.clear()
                if line:
                    yield line
            else:
                buf.append(c)

    def _read_mock_lines(self, stop_event) -> Generator[str, None, None]:
        t_ms = int(time.time() * 1000)
        i = 0
        while not stop_event.is_set():
            # timestamp_ms,egg_ch1_uv,egg_ch2_uv,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z
            line = (
                f"{t_ms + i * 40},{20 + (i % 5)},{18 + (i % 7)},"
                f"{0.1 * ((i % 10) - 5):.3f},{0.2 * ((i % 8) - 4):.3f},{9.7 + (i % 2) * 0.1:.3f},"
                f"0.01,0.02,0.03"
            )
            i += 1
            yield line
            time.sleep(0.04)
