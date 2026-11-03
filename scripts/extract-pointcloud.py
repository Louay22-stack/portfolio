"""Read-only: exports the AnaeroVision records used by the hero point cloud.

Columns: Temperature_C, pH, Methane_Yield_mL_CH4_gVS, inhibited (0/1).
TAN / VFA are not used because most of their values are imputed in the dataset.

Usage: python scripts/extract-pointcloud.py
"""
import json
from pathlib import Path

import openpyxl

site = Path(__file__).resolve().parent.parent
src = site.parent / "AnaeroVision" / "DATASET" / "Operational-dataset.xlsx"
out = site / "content" / "data" / "av-pointcloud.json"

wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
rows = list(wb.active.iter_rows(values_only=True))
head = rows[0]
records = [dict(zip(head, r)) for r in rows[1:]]

points = [
    [
        round(float(r["Temperature_C"]), 2),
        round(float(r["pH"]), 2),
        round(float(r["Methane_Yield_mL_CH4_gVS"]), 1),
        1 if r["Inhibition_Status"] == "Inhibition" else 0,
    ]
    for r in records
]

out.write_text(
    json.dumps(
        {
            "source": "AnaeroVision/DATASET/Operational-dataset.xlsx",
            "columns": ["Temperature_C", "pH", "Methane_Yield_mL_CH4_gVS", "inhibited"],
            "points": points,
        },
        separators=(",", ":"),
    )
)
print(f"{len(points)} points, {sum(p[3] for p in points)} inhibited -> {out}")
