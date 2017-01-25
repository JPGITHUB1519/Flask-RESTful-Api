from flask import Flask, jsonify, abort, make_response, request, url_for
from flask.ext.httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()
app = Flask(__name__)
"""
	Security 

	We have to ask clients to send their authentication information 
	with every request they send to us
"""
@auth.get_password
def getPassword(username):
	""" Obtain a Password for a given Use r"""
	if username == 'jean':
		return 'python'
	return None

@auth.error_handler
def unauthorized():
	#return make_response(jsonify({'error': 'Unauthorized access'}), 401)
	# return 403 for eviting dialog login
	return make_response(jsonify({'error': 'Unauthorized access'}), 403)

# Structure
tasks = [
	{
		'id' : 1,
		'title': u'Buy Groceries',
		'description': u'Milk, Cheese, Pizza, etc',
		'done': False 
	},
	{
		'id': 2,
		'title': u'Learn Angular JS',
		'description': 'Learn Angular to be a powerful web developer',
		'done': False
	}
]

def make_public_task(task):
	new_task = {}
	for field in task:
		if field == 'id':
			new_task['uri'] = url_for('getTask', task_id=task['id'], _external=True)
		else:
			new_task[field] = task[field]
	return new_task

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not Found'}), 404)

# get all tasks
@app.route('/todo/api/v1.0/tasks/', methods=['GET'])
# requires authentication!
@auth.login_required
def getTasks():
	return jsonify({'tasks': [make_public_task(task) for task in tasks]})

# get one task
@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
def getTask(task_id):
	task = [task for task in tasks if task['id'] == task_id]
	if len(task) == 0:
		# resource not found error
		abort(404)
	return jsonify({'task': task[0]})

# Insert a new Task
@app.route('/todo/api/v1.0/tasks/', methods=['POST'])
def createTask():
	# The request.json will have the request data
	if not request.json or not 'title' in request.json:
		# bad request
		abort(400)

	task = {
		# id of last task + 1
		'id': tasks[-1]['id'] + 1,
		'title': request.json['title'],
		# default empty
		'description': request.json.get('description', ''),
		'done': False
	}
	tasks.append(task)
	# 201 -> created
	return jsonify({'task': task}), 201

# update method
@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
def updateTask(task_id):
	task = [task for task in tasks if task['id'] == task_id]
	if len(task) == 0:
		abort(404)
	if not request.json:
		abort(400)
	if 'title' in request.json and type(request.json['title']) != unicode:
		abort(400)
	if 'description' in request.json and type(request.json['description']) is not unicode:
		abort(400)
	if 'done' in request.json and type(request.json['done']) is not bool:
		abort(400)
	task[0]['title'] = request.json.get('title', task[0]['title'])
	task[0]['description'] = request.json.get('description', task[0]['description'])
	task[0]['done'] = request.json.get('done', task[0]['done'])
	return jsonify({'task': task[0]})

# delete method
@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
def deleteTask(task_id):
	task = [task for task in tasks if task['id'] == task_id]
	if len(task) == 0:
		abort(404)
	tasks.remove(task[0])
	return jsonify({'result': True})		

if __name__=='__main__':
	app.run(debug=True)