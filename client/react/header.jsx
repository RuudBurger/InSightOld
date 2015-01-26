define([
    'react',
    'r/menu/main'
], function(
    React,
    MainMenu
){

    return React.createClass({
        render: function() {
            return (
                <header className="main_header">
                    <div className="inner">
                        <MainMenu />
                    </div>
                </header>
            );
        }
    });

});
