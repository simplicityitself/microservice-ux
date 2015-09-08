
var App = React.createClass({

    getInitialState: function () {
        return {

        };
    },
    render: function() {
        return(<UserForm url="http://localhost:9001"/>);
    }

});

var UserForm = React.createClass({
    getInitialState: function () {
        return {
        user: null
        };
    },
    register: function() {
        var comp = this;
        var payload = { first: this.refs.fname.getDOMNode().value,
                        last: this.refs.sname.getDOMNode().value,
                        email: this.refs.email.getDOMNode().value,
                        password: this.refs.password.getDOMNode().value,
                        stream: "users"
                      };
        ohSnap('Yeeaahh! You are now registered.', 'green');

        $.ajax({
            url: "/demoapp/add-user?item=user",
            contentType: 'application/x-www-form-urlencoded',
            type: 'POST',
            form: payload,
            success: function() {
                alert('success');
                ohSnap('Yeeaahh! You are now registered.', 'green');
            },
            error: function(xhr, status, err) {
                console.error(comp.props.url, status, err.toString());
                alert('error');
            }
        });
    },
    login: function() {
        var comp = this;
        var payload = { username: this.refs.username.getDOMNode().value,
                        password: this.refs.loginpass.getDOMNode().value,
                        stream: "access"
                      };

        $.ajax({
            url: "/demoapp/login-user",
            contentType: 'application/x-www-form-urlencoded',
            type: 'POST',
            data: payload,
            success: function() {
                alert('success');
            },
            error: function(xhr, status, err) {
                console.error(comp.props.url, status, err.toString());
                alert('error');
            }
        });
    },
    render: function() {
        var regForm = (
            <div className="form">
                <label>First Name</label>
                <br/>
                <input type="text" ref="fname" />
                <br/>
                <label>Surname</label>
                <br/>
                <input type="text" ref="sname" />
                <br/>
                <label>Email</label>
                <br/>
                <input type="text" ref="email" />
                <br/>
                <label>Password</label>
                <br/>
                <input type="password" ref="password" />
                <br/>
                <button type="button" onClick={this.register}>Register</button>
            </div>);
        var loginForm = (
            <div className="form">
                <label >Username</label>
                <br/>
                <input type="text" ref="username" />
                <br/>
                <label>Password</label>
                <br/>
                <input type="password" ref="loginpass" />
                <br/>
                <button type="button" onClick={this.login}>Login</button>
            </div>);

        return (
            <div className="user-forms">
                {regForm}
                {loginForm}
            </div>);
    }
});

React.render(<App/>, document.getElementById("content"));
