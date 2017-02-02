tasksUri = "http://localhost:5000/todo/api/v1.0/tasks/";

$( document ).ready(function() {
    ajaxCall(tasksUri, "GET", {}, getToDos);
    // update for future links
    $(document).on("click", '.updater', function(e)
    {
    	e.preventDefault();
    	$("#updateModal").modal();
    	$("#UpdateTaskId").val($(this).data("uri"));
    	

    });
});

function getToDos(data)
{
	console.log(data);
	for(var todo in data["tasks"])
	{
		console.log(data["tasks"][todo].title);
		var idtask = data["tasks"][todo].uri.slice(-1);
		var task_dom_element = "#" + idtask
		var update_task_dom_element = "#update_" + idtask;
		var delete_task_dom_element = "#update_" + idtask;
		$("#table tbody").append("<tr id='<%DATA%>'></tr>".replace("<%DATA%>", idtask));
		$(task_dom_element).append("<th><%DATA%></th>".replace("<%DATA%>", data["tasks"][todo].title));
		$(task_dom_element).append("<th><%DATA%></th>".replace("<%DATA%>", data["tasks"][todo].description));
		$(task_dom_element).append("<th><%DATA%></th>".replace("<%DATA%>", data["tasks"][todo].done))
		$(task_dom_element).append("<th><a class='updater' id='<%DOMID%>' href='javascript:void(0)' data-uri='<%URI%>'>Update</a></th>".replace("<%DOMID%>", update_task_dom_element).replace("<%URI%>", data["tasks"][todo].uri));	
		$(task_dom_element).append("<th><a class='deleter' id='<%DOMID%>'>Delete</a></th>".replace("<%DOMID%>", delete_task_dom_element));
		// $(task_dom_element).append("<th><%DATA%></th>".replace("<%DATA%>", data["tasks"][todo].uri))
	}
	// $("#table tbody").append("<h1>Hey</h1>");
}


// AJAX WRAPPER
function ajaxCall(uri, method, data, callback)
{
	username = "jean";
	password = "python";
	var request = 
	{
		url : uri,
		type : "GET",
		datatype : "json",
		data : JSON.stringify(data),
		contentType : "application/json",
		accepts: "application/json",
		beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", 
                        "Basic " + btoa(username + ":" + password));
                },
        error: function(jqXHR) {
                    console.log("ajax error " + jqXHR.status);
                },
        success: callback  	
	}

	return $.ajax(request);
}




// function getToDos()
// {
// 	//Response for preflight is invalid (redirect) -> was for / was missing
// 	// tasksUri = "http://localhost:5000/todo/api/v1.0/tasks";
// 	tasksUri = "http://localhost:5000/todo/api/v1.0/tasks/";
// 	username = "jean";
// 	password = "python";
// 	$.ajax(
// 	{
// 		url : tasksUri,
// 		type : "GET",
// 		datatype : "json",
// 		contentType : "application/json",
// 		accepts: "application/json",
// 		beforeSend: function (xhr) {
//                     xhr.setRequestHeader("Authorization", 
//                         "Basic " + btoa(username + ":" + password));
//                 }
		
// 	})
// 	.done(function(data)
// 	{
// 		console.log(data);
// 	})
// 	.fail(function(textStatus)
// 	{
// 		console.log(textStatus);
// 	});
// }
