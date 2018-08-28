var email = require('./email.js');
var converter = require('json-2-csv');
var fs = require('fs');
var _ = require('lodash');
var logger = require('./logger.js');
var reqServ = require('./requestService.js');

var outputResult = function (err, data) {
	if (err) {
		return logger.error("outputResult - " + err);
	}
	var html = parseJsonToList(data);
	email.sendEmail(html);
}

function sendTodoList() {
	reqServ.getCSV().then(function (res) {
			converter.csv2json(res, outputResult);
		})
		.catch(function (err) {
			logger.error("sendTodoList - " + err);
		});
}

function parseJsonToList(input) {
	var mailHtml = "<html><body><h3>To-do List</h3><ul>"
	for (var item in input) {
		var task = input[item];
		if (task.Done === "Yes") {
			mailHtml += '<li style="text-decoration: line-through;">' + task.Task + "</li>";
		} else {
			mailHtml += "<li>" + task.Task + "</li>";
		}


		var taskChildren = getItemChildren(task, input);
		if (taskChildren.length > 0) {
			mailHtml += "<ul>";
			for (var child in taskChildren) {
				var childTask = taskChildren[child];
				if (childTask.Done === "Yes") {
					mailHtml += '<li style="text-decoration: line-through;">' + childTask.Task + "</li>";
				} else {
					mailHtml += "<li>" + childTask.Task + "</li>";
				}
			}
			mailHtml += "</ul>";
		}

		_.remove(input, function (i) {
			return i.ParentId === task.Id
		})
	}
	mailHtml += "</ul></body></html>";

	return mailHtml;
}

function getItemChildren(item, list) {
	return _.filter(list, function (l) {
		return item.Id === l.ParentId;
	});
}

sendTodoList();
