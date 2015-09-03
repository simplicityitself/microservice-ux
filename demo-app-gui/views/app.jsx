
var App = React.createClass({

    getInitialState: function () {
        return {

        };
    },
    render: function() {

    }

});

var UserForm = React.createClass({
    getInitialState: function () {
        return {
        form: 'login'
        };
    },
    render: function() {
        var form;
        if(this.state.form == 'login'){
            form = (<div>
                    <input type="text" ref="username" />
                    <input type="text" ref="password" />
                    <input type="button" value="Login"  />
                    </div>);
        } else if(this.state.form == 'newUser'){
            form = (<div>
                    <input type="text" ref="username" />
                    <input type="text" ref="password" />
                    <input type="button" value="Login"  />
                    </div>);
        }
        return(<div />);
    }
});



React.render(<App/>, document.getElementById("content"));
