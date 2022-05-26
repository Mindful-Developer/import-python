====
Core
====


Classes
-------

.. autoclass:: Complex
  :members:

.. autoclass:: Tuple
  :members:


.. autoclass:: List
  :members:

.. autoclass:: Dict
  :members:

.. autoclass:: FrozenSet
  :members:

.. class:: String
  
  Additional methods for strings.

  .. autofunction:: capitalize

  .. autofunction:: center

  .. function:: count(sub[, start[, end]])

    Return the number of non-overlapping occurrences of substring sub in the
    range [start, end].

    :param sub: substring to count
    :param start: start index of the range
    :param end: end index of the range
    :return: number of occurrences
    :rtype: number

  .. autofunction:: encode

  .. autofunction:: endswith

  .. autofunction:: expandtabs

  .. autofunction:: find

  .. function:: format([, values])

    Return a formatted version of the string using the format string.
    The format string may contain literal text or replacement fields.
    The fields are identified by braces {fieldNumber}.
    Each replacement field contains one or more format specifiers,
    which define how the corresponding value is converted to a string.
    The field number is optional, but may be present in the specifiers.
    If the field number is not present, the fields are filled in in the order
    they appear in the format string. If field numbers are present,
    they are used to order the fields in the format string.

    :param values: values to insert into the format string
    :return: formatted string
    :rtype: string

  .. autofunction:: format_map

  .. function:: index(sub[, start[, end]])

    Return the index of the first occurrence of substring sub in the range
    [start, end].

    :param sub: substring to find
    :param start: start index of the range
    :param end: end index of the range
    :return: index of the first occurrence
    :rtype: number

  .. autofunction:: isalnum

  .. autofunction:: isalpha

  .. autofunction:: isdigit

  .. autofunction:: isidentifier

  .. autofunction:: islower

  .. autofunction:: isnumeric

  .. autofunction:: isprintable

  .. autofunction:: isspace

  .. autofunction:: istitle

  .. autofunction:: isupper

  .. autofunction:: join

  .. autofunction:: jsReplace

  .. autofunction:: ljust

  .. autofunction:: lower

  .. autofunction:: lstrip

  .. autofunction:: maketrans

  .. autofunction:: partition

  .. autofunction:: replace

  .. autofunction:: rfind

  .. autofunction:: rindex

  .. autofunction:: rjust

  .. autofunction:: rpartition

  .. autofunction:: rsplit

  .. autofunction:: rstrip

  .. autofunction:: startswith

  .. autofunction:: strip

  .. autofunction:: jsSplit

  .. autofunction:: split

  .. autofunction:: splitlines

  .. autofunction:: swapcase

  .. autofunction:: title

  .. autofunction:: translate

  .. autofunction:: upper

  .. autofunction:: zfill




Functions
---------

.. autofunction:: abs

.. autofunction:: all

.. autofunction:: any

.. autofunction:: ascii

.. autofunction:: bin

.. autofunction:: bool

.. autofunction:: breakpoint

.. autofunction:: bytearray

.. autofunction:: bytes

.. autofunction:: callable

.. autofunction:: chr

.. autofunction:: complex

.. autofunction:: delattr

.. autofunction:: dict

.. autofunction:: dir

.. autofunction:: divmod

.. autofunction:: enumerate

.. autofunction:: exec

.. autofunction:: filter

.. autofunction:: float

.. function:: format(string, *args)

  Return a formatted string. The string must have at least one replacement
  sequence, otherwise a TypeError is raised.

  The embedded sequences are substituted by the values in args. The
  sequence has the form ``{}``.

  The result is computed by replacing each occurrence of the embedded
  sequence with the string representation of the corresponding value.

  Example:

  >>> format("{} {}", "a", "b")
  'a b'

.. autofunction:: frozenset

.. autofunction:: getattr

.. autofunction:: hasattr

.. autofunction:: hex

.. autofunction:: input

.. autofunction:: int

.. autofunction:: isinstance

.. autofunction:: issubclass

.. autofunction:: iter

.. autofunction:: len

.. autofunction:: list

.. autofunction:: locals

.. autofunction:: map

.. autofunction:: max

.. autofunction:: min

.. autofunction:: next

.. autofunction:: oct

.. autofunction:: ord

.. autofunction:: pow

.. autofunction:: print

.. autofunction:: range

.. autofunction:: repr

.. autofunction:: reversed

.. autofunction:: round

.. autofunction:: set

.. autofunction:: setattr

.. autofunction:: slice

.. autofunction:: sorted

.. autofunction:: str

.. autofunction:: sum

.. autofunction:: tuple

.. autofunction:: type

.. autofunction:: zip