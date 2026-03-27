# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

# Add your data files (templates, static, etc.)
added_files = [
    ('templates', 'templates'),
    ('static', 'static'),
    ('gutangle.db', '.'), # Initial DB if exists
]

a = Analysis(
    ['desktop_main.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=['jinja2.ext'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='GutAngle',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False, # Set to False to hide the terminal window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='static/img/icon.png' # Optional: Add your icon path here
)
