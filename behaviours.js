// Copyright (c) 2007-2008 Gabriel Gironda
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Behaviours = Class.create()
Object.extend(Behaviours, {
  list: $H({}),
  queue: $A([]),
  
  apply_behaviours: function() {
    this.queue.concat(this.list.keys()).uniq().each(function(entry_name){
      this.list.get(entry_name).each(function(behaviour){
        var matches = $$(behaviour.selector)
        this.apply_behaviour(matches, behaviour.behaviour_function)
      }.bind(this))
    }.bind(this))
  },
  
  observe_and_apply: function() {
    document.observe("dom:loaded", function(){ this.apply_behaviours() }.bind(this))
  },
  
  add: function(selector, behaviour_function, options) {
    options = options || {}
    var entry_name = (options.name || selector)
    var entry_list = this.list.get(entry_name)
    if (!entry_list) { entry_list = this.list.set(entry_name, $A()) }
    if (options.position == 'front') {
      this.queue.unshift(entry_name)
    } else if (options.position == 'end') {
      this.queue.push(entry_name)
    }
    entry_list.push({selector: selector, behaviour_function: behaviour_function, options: options})
  },
  
  apply_named_behaviour: function(name, scoping) {
    var behaviours = this.list.get(name)
    if (!behaviours) { return null }
    scoping = scoping || $$('html')[0]
    behaviours.each(function(behaviour){
      matches = scoping.select(behaviour.selector)
      this.apply_behaviour(matches, behaviour.behaviour_function)
    }.bind(this))
  },
  
  apply_behaviour: function(matches, behaviour_function) {
    if (matches.length == 0) { return null }
    (behaviour_function.length >= 2) ? behaviour_function(matches, matches.length) : behaviour_function(matches.first())
  },
  
  // Ripped from scriptaculous
  require: function(libraryName) {
    // inserting via DOM fails in Safari 2.0, so brute force approach
    document.write('<script type="text/javascript" src="'+libraryName+'"></script>');
  }
})
