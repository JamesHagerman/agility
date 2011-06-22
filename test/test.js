(function($, $$){

  // --------------------------------
  //
  //  Builder
  //
  // --------------------------------

  module("Object builder");

  var validateObject = function(o){
    ok( typeof o.model === 'function', "obj.model defined");
    ok( !$.isEmptyObject(o.view), "obj.view defined");    
    ok( !$.isEmptyObject(o.controller), "obj.controller defined");    
  }

  test("No arguments", function(){
    var obj = $$(); // default object
    validateObject( obj );
    ok($.isEmptyObject(obj.model()), "model is empty");
  });

  test("Dummy arguments", function(){
    var obj = $$({}, {}, {}); // default object
    validateObject( obj );
    ok($.isEmptyObject(obj.model()), "model is empty");
  });

  test("One argument (model string)", function(){
    var obj = $$('Joe Doe');
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("One argument (model object)", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe'
    });
    validateObject( obj );
    equals( obj.view.$root.html(), '', 'template as expected'); // lib doesn't have a default template for an arbitrary model
  });

  test("Two arguments (model, view string)", function(){
    var obj = $$('Joe Doe', '<div>${content}</div>');
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("Two arguments (model object, view string)", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe'
    }, '<div>${first} ${last}</div>');
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("Three arguments (model string, view string, controller object)", function(){
    var obj = $$('Joe Doe', '<div>${content}</div>', {
      init: function(){
        this.view.render();
      }
    });
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("Three arguments (model object, view string, controller object)", function(){
    var obj = $$({first:'Joe', last:'Doe'}, '<div>${first} ${last}</div>', {
      init: function(){
        this.view.render();
      }
    });
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("Three arguments (model string, view object, controller object)", function(){
    var obj = $$('Joe Doe', {template:'<div>${content}</div>'}, {
      init: function(){
        this.view.render();
      }
    });
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });

  test("Three arguments (model object, view object, controller object)", function(){
    var obj = $$({first:'Joe', last:'Doe'}, {template:'<div>${first} ${last}</div>'}, {
      init: function(){
        this.view.render();
      }
    });
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });
  
  test("One full object argument ({model || view || controller})", function(){
    var obj = $$({
      model: {
        first: 'Joe',
        last: 'Doe'        
      },
      view: {
        template: '<div>${first} ${last}</div>'
      },
      controller: {}
    }); // obj
    validateObject( obj );
    equals( obj.view.$root.html(), 'Joe Doe', 'template as expected');
  });
  
  test("Auto-proxying", function(){
    var t = {}, t2 = {};
    var obj = $$({}, {}, {
      test: function(){
        t = this;
      }
    });    
    obj.controller.test.call({});
    equals( t, obj, 'auto-proxying obj.controller.*' );    
    // Not doing this test yet as it requires a function factory (e.g. obj.fn()) to do auto-proxying!
    // obj.fn('test2', function(){ t2 = this; });
    // obj.test2.call({});
    // equals( t2, obj, 'auto-proxying obj.*' );

    t = {}; t2 = {};
    obj = $$({}, {}, {
      test: (function(){
        var fn = function(){ t = this; };
        fn._noProxy = true;
        return fn;
      })()
    });
    var o2 = {};
    obj.controller.test.call(o2);
    equals( t, o2, '_noProxy obj.controller.*' );
    // Not doing this test yet as it requires a function factory (e.g. obj.fn()) to do auto-proxying!
    // obj.fn('test2', function(){ t2 = this; });
    // obj.test2.call(o2);
    // equals( t2, o2, '_noProxy obj.*' );
  });
  

  // ------------------------------------
  //
  //  Post-builder - Default controller
  //
  // ------------------------------------

  module("Post-builder - Default controller");

  test("Tree events", function(){
    var obj1 = $$({}, '<div><span class="here"></span></div>');
    var obj2 = $$('hello');
    obj1.add(obj2, '.here');
    ok( obj1.view.$root.find('.here').find('div').html() === 'hello', 'add() appends at given selector');

    obj1 = $$({}, '<div><span></span></div>');
    obj2 = $$('hello');
    obj1.add(obj2);
    ok( obj1.view.$root.find('span').next().html() === 'hello', 'add() appends at root element');        
  });

  test("Model events", function(){
    var obj1 = $$({}, '<div>${content}</div>');
    obj1.model({content:'Joe Doe'});
    ok(obj1.view.$root.html() === 'Joe Doe', 'obj.model() fires view change');
  });

  // ----------------------------------
  //
  //  Post-builder - Custom controller
  //
  // ----------------------------------

  module("Post-builder - Custom controller");

  test("Tree events", function(){
    var o = {};
    var s = '';
    var obj1 = $$();
    var obj2 = $$({
      controller: {
        add: function(ev, $$o, selector){
          o = $$o;
          s = selector;
        }
      }
    });  
    obj2.add(obj1, 'sel');
    ok(o===obj1 && s==='sel', "add() called");
  });

  test("Model events", function(){
    var t = false;
    var obj = $$({}, {}, {
      change: function(){
        t = true;
      }
    });
    obj.model({a:'hello'});
    ok(t===true, "change() called");
  });

  test("DOM events", function(){
  });

})(jQuery, agility);