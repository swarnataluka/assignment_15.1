var Arrivals = (function() {
    function ArrivalViewModel() { 
        var self = this;
        self.title = "";
        self.status = "";
        self.time = "";
    }

    function ArrivalApiService() { // ArrivalApi is a service function
        var self = this;

// retrieves all arrivals from the API
    self.getAll = function() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', './api/data.json');

		request.onload = function() {
// success
        if (request.status === 200) {
// resolve the promise with the parsed response text (assumes JSON)
            resolve(JSON.parse(request.response));
            } else {
// error retrieving file
            reject(Error(request.statusText));
            }
        };
			request.onerror = function() {
// network errors
            reject(Error("Network Error"));
        };
			request.send();
        });
        };
    }
/* ArrivalAdapter is an adapter function wherein the each data value from the Data.json is passed toArrivalViewModel */
    function ArrivalAdapter() {  
        var self = this;

        self.toArrivalViewModel = function(data) {
            if (data) {
                var vm = new ArrivalViewModel();
                vm.title = data.title;
                vm.status = data.status;
                vm.time = data.time;
                return vm;
            }
				return null;
        };

        self.toArrivalViewModels = function(data) {
            if (data && data.length > 0) {
                return data.map(function(item) {
                return self.toArrivalViewModel(item);
            });
        }
				return [];
    };
}

    function ArrivalController(arrivalApiService, arrivalAdapter) { // ArrivalController function retrieves all the arrivals from the API
		var self = this;

        self.getAll = function() {
// retrieve all the arrivals from the API
				return arrivalApiService.getAll().then(function(response) {
                return arrivalAdapter.toArrivalViewModels(response);
        });
    };
}
// initialize the services and adapters
		var arrivalApiService = new ArrivalApiService();
		var arrivalAdapter = new ArrivalAdapter();
// initialize the controller
		var arrivalController = new ArrivalController(arrivalApiService, arrivalAdapter);    
				return {
loadData: function() { // loadData object has all the retrieved route list and does binds the arrivals to the UI
// retrieve all routes
				document.querySelector(".arrivals-list").classList.add('loading')
				arrivalController.getAll().then(function(response) {
// bind the arrivals to the UI
				Page.vm.arrivals(response);
				document.querySelector(".arrivals-list").classList.remove('loading')
			});
		}
    }
})();