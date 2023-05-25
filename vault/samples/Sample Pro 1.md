---
theme: color-head

paginate: true
_paginate: false
# header: ![w:75](../attachments/placeholder-circle.png)
header: 'Title of deck'
_header: ''
footer: 'this is footer'
_footer: ''
---

<!-- _class: lead -->

# <!-- fit --> Title of Deck

## <!-- fit --> Subtitle Subtitle Subtitle Subtitle Subtitle 

**Author**
Milan, Marp Demo
YYYY/MM/DD


--- 


# Agenda 

1. text
1. text
1. text
1. text

---

# Section

## Subsection

### Subsection 1

#### Subsection 2

##### Subsection 3

###### Subsection 4

Text

---

# Introduction

Text

---

# Text 

text

---

# Two Columns 

## column 1

text

## column 2

text

---

# Two Columns Image

## column 1

text

![bg right](../attachments/placeholder-circle.png)

---

# Three Columns 

## column 1

text

## column 2

text

## column 3

text

---

# Basic Block List 

- text
- text
- text
- text
- text
---

# Picture 

![center](../attachments/placeholder-circle.png)

---

# Table

| text | text | text | text |
|---|---|---|---|
| text | text | text | text |
| text | text | text | text |
| text | text | text | text |

---

# Quote

> Quote of the day

---

# Code

``` javascript
var foo = ""
```


---

<!-- _footer: '' -->
<!-- _paginate: false -->

# Autoscaling Code

```
bool getBit(int num, int i) {
    return ((num & (1<<i)) != 0);
}

bool getBit(int num, int i) {
    return ((num & (1<<i)) != 0) + ((num & (1<<i)) != 0) + ((num & (1<<i)) != 0) + ((num & (1<<i)) != 0) + ((num & (1<<i)) != 0);
}

bool getBit(int num, int i) {
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;int i = 0;
	int i = 0;
	int i = 0;int i = 0;

	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;
	int i = 0;int i = 0;
	int i = 0;
	int i = 0;int i = 0;

    return ((num & (1<<i)) != 0);
    popo
    
}
```

---

# Math

Text text .....:

$$ I_{xx}=\int\int_Ry^2f(x,y)\cdot{}dydx $$

Text text .....:

$$
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$

Conclusion

--- 

# Autoscaling Math

$$
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi + \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi + \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi + \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi + \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi + \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$
