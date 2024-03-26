from flask import Flask, render_template

app = Flask(__name__)

# Sample menu data (you can replace this with your data)
menuData = {
    1: [
        {"name": "와퍼", "price": "7900원", "image": "static/images/tab1_menu1.png"},
        {"name": "치즈와퍼", "price": "6,900원~", "image": "static/images/tab1_menu2.png"},
        # Add more menu items here
    ],
    2: [
        # Add menu items for Tab 2
    ],
    # Add data for other tabs
}

chosen_items = []  # This will store chosen menu items



@app.route('/')
def mode():
    return render_template('mode.html')

@app.route('/menu')
def index():
    return render_template('index.html', menuData=menuData, chosen_items=chosen_items)

@app.route('/basic')
def basic():
    return render_template('basic.html', menuData=menuData, chosen_items=chosen_items)



if __name__ == '__main__':
    app.run(debug=True)
