# Agility.js
 
Agility is an MVC library for client-side Javascript that lets you write **maintainable** code without compromising on **development speed**. It's [write less, do more](http://www.jquery.com) with maintainability. 

## Main site

+ http://agilityjs.com

## Comments on HTML Safe bindings

This fork adds the ability to store HTML in the data model and bind that data to the view. This is done by specifically defining the data-type of the tag as "html":

var message = $$({txt:'Hello World!<br /> This will go on a new line.'},'<div data-bind="txt" data-type="html"/>');
$$.document.append(message);

This binding can be tested by actively updating the data in the model with new HTML content:

message.model.set({txt: "First line<br /><span style='color: red;'>Second line with red text in a span</span>"});


## Core developers

+ Artur Adib (@arturadib)
+ Tristan Slominski (@tristanls)

Core devs are contributors who have a track record of pushing awesome code to Agility. You can become one too!
