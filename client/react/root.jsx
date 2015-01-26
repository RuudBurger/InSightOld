define([
    'react', 'js/router_helper',
    'r/header', 'r/footer'
], function(
    React, ReactRouter,
    Header, Footer
){

    var RouteHandler = ReactRouter.RouteHandler;

    return React.createClass({

        render: function() {

            return (
                <div className='wrapper'>
                    <Header />
                    <div className='inner'>
                        <RouteHandler {...this.props} />
                    </div>
                    <Footer />
                </div>
            );
        }
    });

});
