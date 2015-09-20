ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        $(element).slider(options);
        ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).slider("destroy");
        });
        ko.utils.registerEventHandler(element, "slide", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value)) value = 0;
        $(element).slider("value", parseInt(value, 10));

    }
};

var fixedCost = function (name) {
    this.name = ko.observable(name);
    this.cost = ko.observable(0);
}

var product = function () {
    this.name = ko.observable("");
    this.costPerUnit = ko.observable(0);
    this.salesPerMonth = ko.observable(0);
    this.isEditing = ko.observable(true);
};

var productionCost = function (product) {
    this.name = product.name;
    this.costPerUnit = product.costPerUnit;
    this.productionCost = ko.observable(0);
    this.isEditingProduction = ko.observable(true);

};

var stuff = function () {
    this.name = ko.observable("");
    this.rate = ko.observable(0);
    this.headcount = ko.observable(0);
    this.isEditing = ko.observable(true);
}

var myViewModel = function () {
    this.allProducts = ko.observableArray([new product()]);

    this.addProduct = function () {
        for (var i = this.allProducts().length - 1; i >= 0; i--) {
            this.allProducts()[i].isEditing(false);
        };
        this.allProducts.push(new product());
        bindShit();
    };

    this.sealProducts = function () {
        for (var i = this.allProducts().length - 1; i >= 0; i--) {
            this.allProducts()[i].isEditing(false);
            if (!this.allProducts()[i].name()) {
                this.allProducts.splice(i, 1);
            }
        };
    };

    this.allProductionCosts = ko.observableArray([new productionCost(this.allProducts()[0])]);

    this.nextProductCost = function () {
        if (this.allProductionCosts().length < this.allProducts().length) {
            for (var i = this.allProductionCosts().length - 1; i >= 0; i--) {
                this.allProductionCosts()[i].isEditingProduction(false);
            };
            this.allProductionCosts.push(new productionCost(this.allProducts()[this.allProductionCosts().length]));
            bindShit2();
        }
    };

    this.sealProductCost = function () {
        for (var i = this.allProductionCosts().length - 1; i >= 0; i--) {
            this.allProductionCosts()[i].isEditingProduction(false);
            if (!this.allProductionCosts()[i].name()) {
                this.allProductionCosts.splice(i, 1);
            }
        };
    };

    this.allStuff = ko.observableArray([new stuff()]); // Initial items

    this.addStuff = function () {
        for (var i = this.allStuff().length - 1; i >= 0; i--) {
            this.allStuff()[i].isEditing(false);
        };
        this.allStuff.push(new stuff());
        bindShit3();
    };

    this.sealStuff = function () {
        for (var i = this.allStuff().length - 1; i >= 0; i--) {
            this.allStuff()[i].isEditing(false);
            if (!this.allStuff()[i].name()) {
                this.allStuff.splice(i, 1);
            }
        };
    };

    this.allFixedCosts = ko.observableArray([]);

    this.allFixedCosts.push(new fixedCost("Маркетинг"));
    this.allFixedCosts.push(new fixedCost("Аренда недвижимости"));
    this.allFixedCosts.push(new fixedCost("Прочие затраты"));

    this.selectedNewFixedCostName = ko.observable("");

    this.addFixedCost = function () {
        if (this.selectedNewFixedCostName()) {
            this.allFixedCosts.push(new fixedCost(this.selectedNewFixedCostName()));
        }
    };

    this.selectedCurve = ko.observableArray([]);

    this.selectCurve = function (id) {
        switch (id) {
            case 1:
                this.selectedCurve(this.salesCurves.retailCurve);
                $("#retailChart").parent(".col-md-4").css("background-color", "lightcyan")

                $("#b2bChart").parent(".col-md-4").css("background-color", "")
                $("#startupChart").parent(".col-md-4").css("background-color", "")
                break;
            case 2:
                this.selectedCurve(this.salesCurves.b2bCurve);
                $("#b2bChart").parent(".col-md-4").css("background-color", "lightcyan")

                $("#startupChart").parent(".col-md-4").css("background-color", "")
                $("#retailChart").parent(".col-md-4").css("background-color", "")
                break;
            case 3:
                this.selectedCurve(this.salesCurves.startupCurve);
                $("#startupChart").parent(".col-md-4").css("background-color", "lightcyan")

                $("#retailChart").parent(".col-md-4").css("background-color", "")
                $("#b2bChart").parent(".col-md-4").css("background-color", "")
                break;
        }
    };

    this.salesCurves = {
        startupCurve: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.02, 0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06, 0.07, 0.08, 0.09, 0.11, 0.12, 0.14, 0.16, 0.19, 0.22, 0.25, 0.29, 0.33, 0.38, 0.44, 0.50, 0.58, 0.66, 0.76, 0.88, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
        retailCurve: [0.04, 0.08, 0.12, 0.16, 0.20, 0.24, 0.28, 0.32, 0.36, 0.40, 0.44, 0.48, 0.52, 0.56, 0.60, 0.64, 0.68, 0.72, 0.76, 0.80, 0.84, 0.88, 0.92, 0.96, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
        b2bCurve: [0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.39, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86]
    };

    this.getGain = function () {
        var margin = 0;
        for (var i = this.allProductionCosts().length - 1; i >= 0; i--) {
            margin += (this.allProducts()[i].costPerUnit() - this.allProductionCosts()[i].productionCost()) * this.allProducts()[i].salesPerMonth();
        };
        return margin;
    };

    this.getFullCost = function () {
        var result = 0;
        for (var i = this.allFixedCosts().length - 1; i >= 0; i--) {
            result += this.allFixedCosts()[i].cost();
        };
        for (var i = this.allStuff().length - 1; i >= 0; i--) {
            result += this.allStuff()[i].rate() * this.allStuff()[i].headcount();
        };
        return result;
    };

    this.EBITDA = ko.computed(function () {
        var result = 0;
        var gain = this.getGain();
        var fullCost = this.getFullCost();

        for (var i = this.selectedCurve().length - 1; i >= 0; i--) {
            result += gain * this.selectedCurve()[i] - fullCost;
        };

        return result;

    }, this);
};

var model = new myViewModel();

Chart.defaults.global.showTooltips = false;
Chart.defaults.global.animation = false;
var options = {
    pointDot: false
}

var retailData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [{
        label: "My Second dataset",
        fillColor: "rgba(9,187,205,0.2)",
        strokeColor: "rgba(9,187,205,1)",
        pointColor: "rgba(9,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(9,187,205,1)",
        data: model.salesCurves.retailCurve
    }]
};

var b2bData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [{
        label: "My Second dataset",
        fillColor: "rgba(9,187,205,0.2)",
        strokeColor: "rgba(9,187,205,1)",
        pointColor: "rgba(9,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(9,187,205,1)",
        data: model.salesCurves.b2bCurve
    }]
};

var startupData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [{
        label: "My Second dataset",
        fillColor: "rgba(9,187,205,0.2)",
        strokeColor: "rgba(9,187,205,1)",
        pointColor: "rgba(9,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(9,187,205,1)",
        data: model.salesCurves.startupCurve
    }]
};

var retailChart = new Chart(document.getElementById("retailChart").getContext("2d")).Line(retailData, options);
var b2bChart = new Chart(document.getElementById("b2bChart").getContext("2d")).Line(b2bData, options);
var startupChart = new Chart(document.getElementById("startupChart").getContext("2d")).Line(startupData, options);

ko.applyBindings(model);

function bindShit() {
    $(".namevarPr").click(function (event) {
        model.allProducts().forEach(function (e) {
            if (e.isEditing() == true) {
                e.name(event.target.text);
            }
        });
    });

};

function bindShit3() {
    $(".namevarStf").click(function (event) {
        model.allStuff().forEach(function (e) {
            if (e.isEditing() == true) {
                e.name(event.target.text);
            }
        });
    });

};

$("#jquery-select2-example").select2({
    allowClear: true,
    placeholder: "Выберите статью расходов"
});

bindShit();

bindShit3();

