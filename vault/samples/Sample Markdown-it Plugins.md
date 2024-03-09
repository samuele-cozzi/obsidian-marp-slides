---
theme: minimal-container-turquoise
---
<!-- _class: lead -->
# Title

## Subtitle

---

<!-- _class: box-flex -->
# Columns Containers

**[markdown-it-container](https://github.com/markdown-it/markdown-it-container)**

::: container
## Colum 1

text dadadas text text text text text text text text text text 

:::

::: container
## Colum 2

text

:::


---

# Text Highlights

**[markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)**

This is ==marked== text

---


![bg](../attachments/kroki_cheatsheet_20210515_v1.1_EN.jpeg)

---

# PlantUML Diagram

**[markdown-it-kroki](https://github.com/kazumatu981/markdown-it-kroki)**

```plantuml[platuml image]
@startuml
left to right direction
actor Guest as g
package Professional {
actor Chef as c
actor "Food Critic" as fc
}
package Restaurant {
usecase "Eat Food" as UC1
usecase "Pay for Food" as UC2
usecase "Drink" as UC3
usecase "Review" as UC4
}
fc --> UC4
g --> UC1
g --> UC2
g --> UC3
@enduml
```


---
# Mermaid Gant Diagram

**[markdown-it-kroki](https://github.com/kazumatu981/markdown-it-kroki)**

```mermaid
gantt
	
	title A Gant Diagram  
	dateFormat YYYY-MM-DD  
	section Section  
	Initial milestone : milestone, m1, 2014-01-01,
	Final milestone : milestone, m1, 2014-02-16,
	A task :a1, 2014-01-01, 30d  
	Another task :after a1, 20d  
	section Another
	Task in sec :2014-01-12, 12d  
	another task : 24d
	
```

---

# CallOuts (Work in Progress)

https://github.com/ebullient/markdown-it-obsidian-callouts

