例如：

~~~js
'http://example.com/search?a=1&a=2&b=2#hash'
~~~



~~~js
function MyURLSearchParams(str) {
  str = str.split('?')[1];
  const map = {};
  if (str.includes('#')) {
    str = str.split('#')[0];
  } else {
    str = str.split("'")[0];
  }
  str.split('&').forEach(item => {
    const [key, value] = item.split('=');
    map[key] = value;
  })
  return map;
}
~~~

