
var App = React.createClass({

    getInitialState: function () {
        return {

        };
    },
    render: function() {
        return(<UserForm />);
    }

});

var UserForm = React.createClass({
    getInitialState: function () {
        return {
        form: 'login'
        };
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
                <button type="button">Register</button>
            </div>);
        var loginForm = (
            <div className="form">
                <label >Username</label>
                <br/>
                <input type="text" ref="username" />
                <br/>
                <label>Password</label>
                <br/>
                <input type="password" ref="password" />
                <br/>
                <button type="button">Login</button>
            </div>);

        return (
            <div className="user-forms">
                {regForm}
                {loginForm}
            </div>);
    }
});



React.render(<App/>, document.getElementById("content"));
