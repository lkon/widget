define(
	function(){
		window.Widget = window.Widget || {};
		Widget = {
			Models : {},
			Collections : {},
			Views : {},
			util : {},
			visible : [],
			rubric : {},
			getData : {},
			context: '',
			weather: {
				capitals : {},
				charObject : {}
			}

		};
		return Widget;
	}
);
