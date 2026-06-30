#!/usr/bin/env python3
"""Generate 100 developer-editable Bubble Puppy levels as JSON."""
import json
import random
from pathlib import Path

random.seed(42)

# 10 base themes (matching the original 10 levels)
BASE_THEMES = [
    {
        "name": "花园草地",
        "tile": "tile_grass",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_cat", "enemy_squirrel", "enemy_owl"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 80, "x2": 240, "y": 450},
            {"type": "range", "x1": 560, "x2": 720, "y": 450},
            {"type": "range", "x1": 320, "x2": 480, "y": 320},
            {"type": "single", "x": 150, "y": 200},
            {"type": "single", "x": 650, "y": 200},
            {"type": "single", "x": 400, "y": 130},
        ],
        "letterPositions": [
            {"x": 150, "y": 160}, {"x": 650, "y": 160}, {"x": 400, "y": 90},
            {"x": 100, "y": 410}, {"x": 700, "y": 410}, {"x": 400, "y": 280},
        ],
        "timeLimit": 120,
    },
    {
        "name": "客厅沙发",
        "tile": "tile_wood",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_cat", "enemy_hamster", "enemy_raccoon"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 50, "x2": 200, "y": 480},
            {"type": "range", "x1": 600, "x2": 750, "y": 480},
            {"type": "range", "x1": 250, "x2": 550, "y": 380},
            {"type": "single", "x": 100, "y": 280},
            {"type": "single", "x": 700, "y": 280},
            {"type": "single", "x": 400, "y": 180},
            {"type": "single", "x": 200, "y": 120},
            {"type": "single", "x": 600, "y": 120},
        ],
        "letterPositions": [
            {"x": 100, "y": 240}, {"x": 700, "y": 240}, {"x": 400, "y": 140},
            {"x": 80, "y": 440}, {"x": 720, "y": 440}, {"x": 400, "y": 340},
        ],
        "timeLimit": 110,
    },
    {
        "name": "厨房瓷砖",
        "tile": "tile_kitchen",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_squirrel", "enemy_bee", "enemy_raccoon"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 100, "x2": 300, "y": 500},
            {"type": "range", "x1": 500, "x2": 700, "y": 500},
            {"type": "single", "x": 400, "y": 420},
            {"type": "range", "x1": 150, "x2": 350, "y": 340},
            {"type": "range", "x1": 450, "x2": 650, "y": 340},
            {"type": "single", "x": 80, "y": 240},
            {"type": "single", "x": 720, "y": 240},
            {"type": "single", "x": 400, "y": 160},
            {"type": "single", "x": 250, "y": 100},
            {"type": "single", "x": 550, "y": 100},
        ],
        "letterPositions": [
            {"x": 80, "y": 200}, {"x": 720, "y": 200}, {"x": 400, "y": 120},
            {"x": 200, "y": 460}, {"x": 600, "y": 460}, {"x": 400, "y": 300},
        ],
        "timeLimit": 100,
    },
    {
        "name": "后院泥坑",
        "tile": "tile_mud",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_owl", "enemy_hamster", "enemy_bee", "enemy_cat"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "single", "x": 120, "y": 500},
            {"type": "single", "x": 680, "y": 500},
            {"type": "range", "x1": 250, "x2": 550, "y": 450},
            {"type": "single", "x": 80, "y": 380},
            {"type": "single", "x": 720, "y": 380},
            {"type": "range", "x1": 200, "x2": 600, "y": 300},
            {"type": "single", "x": 150, "y": 200},
            {"type": "single", "x": 650, "y": 200},
            {"type": "single", "x": 400, "y": 120},
        ],
        "letterPositions": [
            {"x": 150, "y": 160}, {"x": 650, "y": 160}, {"x": 400, "y": 80},
            {"x": 120, "y": 340}, {"x": 680, "y": 340}, {"x": 400, "y": 260},
        ],
        "timeLimit": 100,
    },
    {
        "name": "狗狗梦境",
        "tile": "tile_grass",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_bee", "enemy_owl", "enemy_raccoon", "enemy_hamster", "enemy_squirrel"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "single", "x": 100, "y": 520},
            {"type": "single", "x": 700, "y": 520},
            {"type": "single", "x": 250, "y": 460},
            {"type": "single", "x": 550, "y": 460},
            {"type": "single", "x": 400, "y": 400},
            {"type": "single", "x": 150, "y": 320},
            {"type": "single", "x": 650, "y": 320},
            {"type": "single", "x": 300, "y": 240},
            {"type": "single", "x": 500, "y": 240},
            {"type": "single", "x": 400, "y": 160},
            {"type": "single", "x": 200, "y": 100},
            {"type": "single", "x": 600, "y": 100},
        ],
        "letterPositions": [
            {"x": 200, "y": 60}, {"x": 600, "y": 60}, {"x": 400, "y": 120},
            {"x": 150, "y": 280}, {"x": 650, "y": 280}, {"x": 400, "y": 360},
        ],
        "timeLimit": 90,
    },
    {
        "name": "霓虹迷宫",
        "tile": "tile_kitchen",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_cat", "enemy_cat", "enemy_bee", "enemy_bee", "enemy_owl", "enemy_owl"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 50, "x2": 200, "y": 520},
            {"type": "range", "x1": 600, "x2": 750, "y": 520},
            {"type": "range", "x1": 200, "x2": 600, "y": 440},
            {"type": "range", "x1": 100, "x2": 300, "y": 360},
            {"type": "range", "x1": 500, "x2": 700, "y": 360},
            {"type": "range", "x1": 250, "x2": 550, "y": 280},
            {"type": "range", "x1": 150, "x2": 350, "y": 200},
            {"type": "range", "x1": 450, "x2": 650, "y": 200},
            {"type": "single", "x": 400, "y": 120},
        ],
        "letterPositions": [
            {"x": 125, "y": 320}, {"x": 675, "y": 320}, {"x": 400, "y": 80},
            {"x": 400, "y": 400}, {"x": 250, "y": 160}, {"x": 550, "y": 160},
        ],
        "timeLimit": 85,
    },
    {
        "name": "高空跳跃",
        "tile": "tile_wood",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_hamster", "enemy_hamster", "enemy_owl", "enemy_bee"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "single", "x": 150, "y": 520},
            {"type": "single", "x": 400, "y": 480},
            {"type": "single", "x": 650, "y": 520},
            {"type": "single", "x": 250, "y": 400},
            {"type": "single", "x": 550, "y": 400},
            {"type": "single", "x": 150, "y": 320},
            {"type": "single", "x": 650, "y": 320},
            {"type": "single", "x": 300, "y": 240},
            {"type": "single", "x": 500, "y": 240},
            {"type": "single", "x": 200, "y": 160},
            {"type": "single", "x": 600, "y": 160},
            {"type": "single", "x": 400, "y": 100},
        ],
        "letterPositions": [
            {"x": 400, "y": 60}, {"x": 200, "y": 120}, {"x": 600, "y": 120},
            {"x": 150, "y": 280}, {"x": 650, "y": 280}, {"x": 400, "y": 440},
        ],
        "timeLimit": 80,
    },
    {
        "name": "左右夹击",
        "tile": "tile_mud",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_raccoon", "enemy_raccoon", "enemy_cat", "enemy_cat", "enemy_squirrel"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 50, "x2": 250, "y": 500},
            {"type": "range", "x1": 550, "x2": 750, "y": 500},
            {"type": "single", "x": 400, "y": 460},
            {"type": "range", "x1": 100, "x2": 350, "y": 380},
            {"type": "range", "x1": 450, "x2": 700, "y": 380},
            {"type": "single", "x": 400, "y": 300},
            {"type": "range", "x1": 150, "x2": 300, "y": 220},
            {"type": "range", "x1": 500, "x2": 650, "y": 220},
            {"type": "single", "x": 400, "y": 140},
            {"type": "single", "x": 200, "y": 80},
            {"type": "single", "x": 600, "y": 80},
        ],
        "letterPositions": [
            {"x": 200, "y": 40}, {"x": 600, "y": 40}, {"x": 400, "y": 100},
            {"x": 225, "y": 180}, {"x": 575, "y": 180}, {"x": 400, "y": 260},
        ],
        "timeLimit": 75,
    },
    {
        "name": "终极挑战",
        "tile": "tile_grass",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_bee", "enemy_bee", "enemy_owl", "enemy_owl", "enemy_hamster", "enemy_hamster", "enemy_cat"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "single", "x": 100, "y": 540},
            {"type": "single", "x": 300, "y": 500},
            {"type": "single", "x": 500, "y": 500},
            {"type": "single", "x": 700, "y": 540},
            {"type": "single", "x": 200, "y": 420},
            {"type": "single", "x": 600, "y": 420},
            {"type": "single", "x": 400, "y": 380},
            {"type": "single", "x": 100, "y": 320},
            {"type": "single", "x": 700, "y": 320},
            {"type": "single", "x": 300, "y": 260},
            {"type": "single", "x": 500, "y": 260},
            {"type": "single", "x": 400, "y": 180},
            {"type": "single", "x": 200, "y": 120},
            {"type": "single", "x": 600, "y": 120},
            {"type": "single", "x": 400, "y": 60},
        ],
        "letterPositions": [
            {"x": 400, "y": 20}, {"x": 200, "y": 80}, {"x": 600, "y": 80},
            {"x": 100, "y": 280}, {"x": 700, "y": 280}, {"x": 400, "y": 340},
        ],
        "timeLimit": 70,
    },
    {
        "name": "黄金终章",
        "tile": "tile_kitchen",
        "bg": "bg_sky",
        "enemyTypes": ["enemy_cat", "enemy_squirrel", "enemy_owl", "enemy_hamster", "enemy_raccoon", "enemy_bee"],
        "platforms": [
            {"type": "ground", "y": 584},
            {"type": "range", "x1": 50, "x2": 150, "y": 520},
            {"type": "range", "x1": 650, "x2": 750, "y": 520},
            {"type": "single", "x": 400, "y": 500},
            {"type": "range", "x1": 150, "x2": 350, "y": 440},
            {"type": "range", "x1": 450, "x2": 650, "y": 440},
            {"type": "single", "x": 400, "y": 380},
            {"type": "range", "x1": 100, "x2": 300, "y": 320},
            {"type": "range", "x1": 500, "x2": 700, "y": 320},
            {"type": "single", "x": 400, "y": 260},
            {"type": "range", "x1": 200, "x2": 400, "y": 200},
            {"type": "range", "x1": 400, "x2": 600, "y": 200},
            {"type": "single", "x": 400, "y": 120},
            {"type": "single", "x": 200, "y": 80},
            {"type": "single", "x": 600, "y": 80},
        ],
        "letterPositions": [
            {"x": 400, "y": 80}, {"x": 200, "y": 40}, {"x": 600, "y": 40},
            {"x": 200, "y": 280}, {"x": 600, "y": 280}, {"x": 400, "y": 220},
        ],
        "timeLimit": 60,
    },
]

ALL_ENEMY_TYPES = [
    "enemy_cat", "enemy_squirrel", "enemy_owl", "enemy_hamster",
    "enemy_raccoon", "enemy_bee", "enemy_hedgehog", "enemy_frog",
]


def vary_platforms(platforms, level_index):
    """Slightly vary platform y/x to make levels feel different while staying playable."""
    varied = []
    for p in platforms:
        np = dict(p)
        if p["type"] == "ground":
            varied.append(np)
            continue
        # small random offset, decreasing as levels get harder
        jitter = max(0, 12 - level_index // 10)
        if "y" in np:
            np["y"] = int(round(np["y"] + random.randint(-jitter, jitter)))
        if "x" in np:
            np["x"] = int(round(np["x"] + random.randint(-jitter, jitter)))
        if "x1" in np:
            np["x1"] = int(round(np["x1"] + random.randint(-jitter, jitter)))
            np["x2"] = int(round(np["x2"] + random.randint(-jitter, jitter)))
            # keep sorted
            np["x1"], np["x2"] = sorted([np["x1"], np["x2"]])
        varied.append(np)
    return varied


def vary_letters(letter_positions, level_index):
    """Add tiny jitter to letter positions so repeats don't look identical."""
    jitter = max(0, 10 - level_index // 12)
    varied = []
    for pos in letter_positions:
        varied.append({
            "x": int(round(pos["x"] + random.randint(-jitter, jitter))),
            "y": int(round(pos["y"] + random.randint(-jitter, jitter))),
        })
    return varied


def build_level(level_index):
    theme = BASE_THEMES[(level_index - 1) % len(BASE_THEMES)]

    # Difficulty curve
    cycle = (level_index - 1) // len(BASE_THEMES)
    base_count = theme["timeLimit"]  # proxy for original difficulty
    enemy_count = min(
        18,
        max(3, theme["enemyTypes"].__len__() + cycle * 2 + (level_index // 15)),
    )
    # More enemy variety in later cycles
    enemy_pool = list(theme["enemyTypes"])
    if cycle >= 1:
        enemy_pool = list(dict.fromkeys(enemy_pool + ALL_ENEMY_TYPES[:3]))
    if cycle >= 2:
        enemy_pool = list(dict.fromkeys(enemy_pool + ALL_ENEMY_TYPES[3:]))

    # Time decreases slightly per cycle, clamped
    time_limit = max(45, theme["timeLimit"] - cycle * 5)

    # Compose enemyTypes array with repeats to reach enemy_count
    enemy_types = []
    for i in range(enemy_count):
        enemy_types.append(enemy_pool[i % len(enemy_pool)])

    name = f"第{level_index}关 {theme['name']}"

    return {
        "name": name,
        "tile": theme["tile"],
        "bg": theme["bg"],
        "enemyTypes": enemy_types,
        "enemyCount": enemy_count,
        "platforms": vary_platforms(theme["platforms"], level_index),
        "letterPositions": vary_letters(theme["letterPositions"], level_index),
        "timeLimit": time_limit,
    }


def main():
    levels = [build_level(i) for i in range(1, 101)]
    out_path = Path(__file__).resolve().parent.parent / "client" / "assets" / "data" / "levels.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(levels, f, ensure_ascii=False, indent=2)
    print(f"Generated {len(levels)} levels -> {out_path}")


if __name__ == "__main__":
    main()
