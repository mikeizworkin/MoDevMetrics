<HTML>
	<HEAD>
	</HEAD>
	<BODY>
		<script type="text/javascript" src="../../js/rest/RestConfig.js"></script>

		<script type="text/javascript" src="../../../../lib/js/jquery-1.7.js"></script>

		<script type="text/javascript" src="../../js/charts/HelperFunctions.js"></script>
		<script type="text/javascript" src="../../js/rest/RestQuery.js"></script>
		<script type="text/javascript" src="../../js/charts/Status.js"></script>
		<script type="text/javascript" src="../../js/charts/DataSet.js"></script>
		<script type="text/javascript" src="../../js/charts/RangeCharts.js"></script>
		<script type="text/javascript" src="../../js/charts/RangeIterator.js"></script>
		<script type="text/javascript" src="../../js/charts/DateRangeIterator.js"></script>

	    <script type="text/javascript" src="../../../../lib/webdetails/cdf/Base.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/cdf/jquery.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/cdf/jquery.tooltip.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/data/q01-01.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/lib/protovis-d3.3.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/lib/jquery.tipsy.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/lib/tipsy.js"></script>
	    <link type="text/css" href="../../../../lib/webdetails/lib/tipsy.css" rel="stylesheet"/>
	
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvc.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcPanel.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcLegend.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcTimeseriesAbstract.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcCategoricalAbstract.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcWaterfall.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcPie.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcBar.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcLine.js"></script>
	    <script type="text/javascript" src="../../../../lib/webdetails/pvc/pvcData.js"></script>
	    <link type="text/css" rel="stylesheet" href="../../../../lib/webdetails/cdf/jquery.tooltip.css"/>
	    <link type="text/css" rel="stylesheet" href="../../../../lib/webdetails/pvcComponent.css"/>
			
	    <script type="text/javascript" src="../../../../lib/webdetails/pvcDocUtils.js"></script>

		<link type="text/css" href="../css/start/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
		<script type="text/javascript" src="../../../../lib/js/jquery-ui-1.8.16.custom.min.js"></script>
		<script type="text/javascript" src="../../../../lib/js/jquery.ba-bbq.js"></script>
		<script type="text/javascript" src="js/charts/GUIFunctions.js"></script>
		<script type="text/javascript" src="../../js/filters/GUIFilters.js"></script>
	    <link type="text/css" rel="stylesheet" href="../css/menu.css"/>

		<script type="text/javascript">

		GUI.GetURLState();
		
		var rangeChart = null;

		customFilters = 
			[
				{
					"name" : "Firefox_Core",
					"filters" : [ 										
						{ "term" : { "product" : "Firefox" } },
						{ "term" : { "product" : "Core" } },
					]
				}
			];
		
		var createChart = function()
		{
			if( rangeChart != undefined )
			{
				rangeChart.Kill();
			}
				
			var chartRequest = { 
					"requests" :[
					{
						"query" : {
							"query" : {
								"bool" : {
									"must" : [
								        { "term" : { "_type" : "attachment" } },
										{ "term" : { "is_patch" : "true" } },
						            ]
								}
							},
							"from" : 0,
							"size" : 0,
							"sort" : []
						},
						"seriesName" : "total prev",
						"dayShift" : -1,
					},
					{
						"query" : {
							"query" : {
								"bool" : {
									"must" : [
								        { "term" : { "_type" : "attachment" } },
										{ "term" : { "is_patch" : "true" } },
						            ]
								}
							},
							"from" : 0,
							"size" : 0,
							"sort" : []
						},
						"seriesName" : "total",
					},
					{
						"query" : {
							"query" : {
								"bool" : {
									"must" : [
								        { "term" : { "_type" : "attachment" } },
										{ "term" : { "requests" : "review+" } },
										{ "term" : { "is_patch" : "true" } },
						            ]
								}
							},
							"from" : 0,
							"size" : 0,
							"sort" : []
						},
						"seriesName" : "accepted",
					},
					{
						"query" : {
							"query" : {
								"bool" : {
									"must" : [
								        { "term" : { "_type" : "attachment" } },
										{ "term" : { "requests" : "review+" } },
										{ "term" : { "is_patch" : "true" } },
						            ]
								}
							},
							"from" : 0,
							"size" : 0,
							"sort" : []
						},
						"seriesName" : "accepted prev",
						"dayShift" : -1,
					}],
					"evaluations" : { 
						'Accepted Velocity' : ['accepted', '-', 'accepted prev'],
						'Total Velocity' : ['total', '-', 'total prev'],
						'Growth Velocity' : ['Accepted Velocity','-','Total Velocity'],
				 	},
					"showSeries" : [ 'Total Velocity', 'Accepted Velocity', 'Growth Velocity' ],
					"chartTitle" : "Daily Patch Acceptance rate",
					"canvas" : "chart",
					"originZero" : true,
					"chartType" : "LineChart",
					"groupSize" : 7,
					"startDate" : state["startDate"],
					"endDate" : state["endDate"]					
				};

				ES.InjectFilters( chartRequest.requests );

				console.log("chartRequest: " + JSON.stringify(chartRequest));
    		
	    		rangeChart = new RangeChart(chartRequest);
	    		rangeChart.run();	
		};

		var filterUI = null;
		
		$(document).ready(function(){
				filterUI = new ProductUI();
				UpdateTextFields();
		    	createChart();
		});
		
		//Code for updating URL paramaters: window.location('address_goes_here');
		</script>
	
	<table style="width: 100%;">
	<tr>
	<td style="width: 300px;  vertical-align:text-top;">
			<div id="filters" class="menu"></div>
	</td>
	<td style="vertical-align:text-top;">    
		<table style="margin-left: auto; margin-right: auto; border: 0px solid black;">			
			<tr>	
				<td style="width: 800px; height: 100px; margin-left: auto; margin-right: auto;">
					<div style="text-align: center;font:10px arial,sans-serif;">
						Start Date <input type="text" id="startDate"><input type="text" id="endDate"> End Date
					</div> 
				</td>
			</tr>
		</table>	    
		<table style="margin-left: auto; margin-right: auto; border: 1px solid black;">			
			<tr>
				<td style="width: 800px; height: 400px; margin-left: auto; margin-right: auto;">
					<div id="chart"></div>		
				</td>
			</tr>
			<tr>
				<td>
					<div id="status" style="text-align: center; font:10px arial,sans-serif;">Chart Loading...</div>
				</td>
			</tr>
			<tr>
				<td>
					<div id="progressbar" style="height: 10px; width: 200px; margin-left: auto; margin-right: auto;"></div>
				</td>
			</tr>
		</table>
		</td>
		</tr>
	</table>
		<div id="report"></div>
		<div id="info"></div>		
		<div id="description"></div>
			
	</BODY>
</HTML>