import os
import sys

# Workaround for WinError 1114 in some Windows environments
# This tries to pre-load dependencies or set flags that bypass certain init routines
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

try:
    import torch
    print(f"SUCCESS: Torch loaded version {torch.__version__}")
    print(f"Path: {torch.__file__}")
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()
