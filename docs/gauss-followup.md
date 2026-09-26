# Gauss awakening: paired fan volley

Normal progression remains 1/2/3 bullets at levels 1/3/5. Awakening fires the same fan, then repeats its three angles 90ms later at 60% first-volley damage. The existing awakening damage multiplier and attack cadence remain. Penetration is removed and lifetime returns to 1.2s (660 travel distance). Follow-ups use simulation time, freeze on pause, cannot fire after end, and are scoped to the current run. Short tracer art differentiates the two volleys from a laser beam.

30-second stationary benchmark, level 5, rapid 3, no research, deterministic random: old awakened Gauss DPS boss/line/surround = 316/1576/526; new = 505/505/505. Awakened laser = 344/1836/574; drone = 670/670/670. Unawakened Gauss stays 191/191/191. These are controlled target fixtures, not measured clear rates; the change favors focused fire and sacrifices line penetration. Follow-up damage avoids doubling the prior single-target output.

Regression coverage: levels 1–5 in all difficulties, exact volley timing and direction, 60% damage, pause/end behavior, run reset and no penetration. Shop/pause weapon text updated.
