from flask import Flask

app = Flask(__name__)

@app.route('/members')
def hello():
    return ({'members': ['members1', 'members2', 'members3',]})

if __name__ == '__main__':
    app.run()

