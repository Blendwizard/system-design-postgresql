# System Design

## Summary
**Assigned Task:**
<ul>
  <li>Implementing and optimizing a complete backend system for a user-facing E-commerce website.</li>
  <li>The service must be able to withstand 200 requests-per-second with a <1% network error rate and <2000ms average response time.</li>
</ul>

**Execution:**
<ul>
  <li>Leveraged PostgreSQL to serve as the primary database and optimize query times.</li>
  <li>Created efficient data ETL pipeline to maximize time for scaling and optimization.</li>
  <li>Implemented load tests to find potential bottlenecks prior to deployment.</li>
  <li>Deployed to AWS and separated concerns for further testing and optimization</li>
  <li>Implemented a load balancer and scaled horizontally to maximize service performance.</li>
  <li>Stress tested service to ensure performance under load</li>
</ul>

**Results:**
<ul>
  <li>Reduced worst-case query time from 3000-4000ms to 20-30ms.</li>
  <li>Maintained <1% error rate on deployed servers</li>
  <li>Deployed load balancing to increase load to a stable 1500 RPS with an average 71ms response time.</li>
</ul>
