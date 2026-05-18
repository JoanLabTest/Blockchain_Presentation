# Chart of the Week: The 412ms EBA Clearing Latency Tax

*A quick note from the European Payments Desk.*

Look at the difference between a Tuesday at 10:00 AM and a Saturday at 2:00 PM on the European payment rails.

On a Tuesday, SEPA Instant transactions hit an average latency of **15 milliseconds**. It's fast, boring, and predictable.

But pull the telemetry for Saturday afternoon, and the latency spikes to **412 milliseconds**.

Why should anyone care about a 400-millisecond delay? Because if you are trying to execute an atomic, cross-border smart contract on a Saturday using tokenized deposits, that 412ms gap is enough to cause a settlement failure. The contract assumes instant liquidity, but the legacy banking pipes are metaphorically "turned off" for the weekend.

The narrative that MiCA solved European crypto regulation misses the point. You can't regulate away a physical liquidity bottleneck. Until central bank liquidity windows operate 24/7, the promise of "programmable finance" stops at 5:00 PM on Friday.

*If you're building weekend DvP models, you can pull the raw EBA/TARGET2 baseline telemetry directly from [dcmcore.com/data/eurosystem-baseline.json](https://dcmcore.com/data/eurosystem-baseline.json).*
