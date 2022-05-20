=============
import-python
=============


.. autofunction:: py_import

.. code-block:: javascript

  // import the module to a single variable
  const itertools = py_import('itertools')

  // destructuring assignment to import the different functions or classes
  const { permutations, combinations } = py_import('itertools')


.. autofunction:: py_import_star

.. code-block:: javascript

  // only recommended for the core python module but can be used for any module
  py_import_star('core')