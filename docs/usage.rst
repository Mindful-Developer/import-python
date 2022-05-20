=====
Usage
=====


Installation
------------

.. code-block:: console

   npm install import-python


Quickstart
----------

.. code-block:: javascript

   const { py_import_star, py_import } = require('import-python')
   const itertools = py_import('itertools') // import a module
   const { random } = py_import_star('random') // destructured import

   // import all Python core built-in function and classes into the global namespace
   py_import_star('core')

   // use any Python core function or class as a JavaScript function
   from (let i of range(10, 20, 2)) {
      print(i, end=', ')
   }


Examples
--------

none yet