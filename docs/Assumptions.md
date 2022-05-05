# Assumption

**In terms of api_design, I've assumed the following**

- Users will be modelled based on email, name and password
- An api_key will be generated for every_user (without throttling)
- Users will have the province to refresh their token
- User's id will be getting mapped to the shortened_urls that will be created
- Base64 encoding with 8-digit length i.e around 281T possible-strings

**In terms of System Design perspective, when sent to production I'll take the following into consideration**

- 80:20 caching for most used urls
- Cron-job to remove least used caches and also to check the default expiry timer for urls (during low traffic)
- Assuming having 500M shorting per/month, and increasing the throughput of the DB, I've used NoSQL for easy-scaling
- Also to balance load, we can use Consistent hashing for less_latency
