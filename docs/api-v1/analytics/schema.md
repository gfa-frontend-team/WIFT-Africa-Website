# Analytics Schema

## PostAnalytics Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `postId` | String | ID of the post. |
| `postType` | String | `IMAGE` or `VIDEO`. |
| `discovery` | Object | Reach metrics. |
| `discovery.impressions` | Number | Total views. |
| `discovery.membersReached` | Number | Unique accounts reached. |
| `engagement` | Object | Interaction metrics. |
| `engagement.likes` | Number | Count of likes. |
| `engagement.totalWatchTime` | Number | Total seconds watched (Video only). |
| `viewerDemography` | Object | Audience breakdown. |
| `viewerDemography.byLocation` | Array | Views grouped by city/country. |
| `viewerDemography.byRole` | Array | Views grouped by user role. |
