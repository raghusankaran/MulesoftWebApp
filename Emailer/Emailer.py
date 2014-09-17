url = "http://mule-perflab06.managed.contegix.com:8080/job/PERF_CI/api/json?tree=builds[number,url]"
r = requests.get(url, params=None)
perfJobList = json.loads(r.content)

builds = perfJobList['builds']

if(currentPerfJob != str(builds[0]['number']) || currentPerfJob == 'xxx' || status == 'In Progress'):
	currentPerfJob = str(builds[0]['number']

    url = "http://mule-perflab06.managed.contegix.com:8080/job/PERF_CI/%s/api/json?tree=result" % currentPerfJob
    r = requests.get(url, params=None)
    status = json.loads(r.content)['result']
    
    if(status == None):
    	status == 'In Progress'

    else:
    	url = "http://mule-perflab06.managed.contegix.com:8880/getParsedDataNoAuth?id=%s&jobName=PERF_CI" % currentPerfJob
		r = requests.get(url, params=None)
		#get job results
		data = json.loads(r.content)
	
		for job, values in data.iteritems():
			#get slas
    		url = "http://mule-perflab06.managed.contegix.com:8880/getTestMetrics?job=%s" % job
    		r = requests.get(url, params=None)
    		sla = json.loads(r.content)['sla']

			#compare
			metrics = values['SingularData'].keys()

			for metric, range in sla.iteritems():
				type = metric[1:metric.index(')')]
				name = metric[metric.index(')')+1:]
				name = name.replace(" ", "_")
				results = values['SingularData'][type].keys()
				if(type == 'System Resources'):
					for k, v in results.iteritems():
						if(name == k[metric.index(')')+2:]):
							
							num = float(v)
							if num >= range[0] && num <= range[1]:
								#set this to true
				else:	    				
    				if name in results:
    					num = float(values['SingularData'][type][name])
    					if num >= range[0] && num <= range[1]:
    						#set this to true

		#send email