---
theme: academic
paginate: true
math: latex
---

<!-- _class: lead -->
# Create lab presentation slides with Marp

#### ~Let's graduate from Beamer~

<br>

**Author Taro**
Hogehoge Laboratory M2
YYYY/MM/DD

---

<!-- _header: table of contents -->

1. First of all
1. Code block
1. Formula
1. Figure

---

<!-- _header: Introduction -->

- Marp is software for creating **slides** in **Markdown**.
  - Basic Markdown syntax is supported.
- You can move to the next page just by putting `---` in Markdown. $^1$

> 1: Marp is developed according to the Markdown specification called CommonMark, so the "footnote" grammar (using `[^1]`), which is not included in CommonMark, is not provided. Therefore, by referring to https://github.com/marp-team/marp/discussions/150#discussioncomment-1302384, a pseudo-footnote was realized.

---

<!-- _header: code block -->

```python
import torch
print(torch.cuda.is_available())
```

You can write a code block like this.

```python
from transformers import AutoModelForMaskedLM, AutoTokenizer
model = AutoModelForMaskedLM.from_pretrained("cl-tohoku/bert-base-japanese-whole-word-masking")
tokenizer = AutoTokenizer.from_pretrained("cl-tohoku/bert-base-japanese-whole-word-masking")

inputs = tokenizer.encode_plus("I'm very [MASK]", return_tensors='pt')
outputs = model(**inputs)
tokenizer.convert_ids_to_tokens(outputs.logits[0][1:-1].argmax(axis=-1))
```

The width is automatically adjusted (see [Auto-scaling](https://github.com/marp-team/marp-core#auto-scaling-features) in the document).

---

<!-- _header: formula -->

$$I_{xx}=\int\int_Ry^2f(x,y)\cdot{}dydx$$

$$
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$

You can write the formula like this. Of course you can also use inline $\LaTeX$.
You can also use emojis :smile:

---

<!-- _header: Figure -->

1. First, right-click to download the image (`kenkyu_woman_seikou.png`) from [This Irasutoya link](https://www.irasutoya.com/2018/10/blog-post_723.html).
2. Create a directory named `images` in this directory with Markdown, and place the image you downloaded earlier. You are now ready to go.

![w:300 center](../attachments/kenkyu_woman_seikou.png)