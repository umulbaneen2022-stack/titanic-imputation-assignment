# Titanic Dataset – Imputation Assignment

## 🎯 Assignment Goal
The main objective of this assignment is to handle missing values (NaN) in the Titanic dataset and apply different imputation techniques to improve data quality for analysis.

---

## 📌 Work Done

### 1️⃣ Loaded the Dataset  
- Imported the Titanic dataset from an online source (GitHub CSV link).

### 2️⃣ Checked Missing Values  
- Used `isnull().sum()` to identify all columns with missing values.

### 3️⃣ Imputed Missing Age Values Using Two Methods  
#### ✔ **Imputation by Sex**
- Calculated median age separately for males and females.
- Filled missing Age values with the median based on Sex.

#### ✔ **Imputation by Title**
- Extracted Title (Mr, Miss, Mrs, Master, etc.) from the `Name` column using string operations.
- Grouped uncommon titles such as **Dr, Rev, Col, Major, Lady, Sir** under a single label: **Rare**.
- Calculated median age for each Title group.
- Filled remaining missing Age values based on the Title’s median age.

### 4️⃣ Why Imputation Was Used  
- Missing values can lead to incorrect or incomplete analysis.  
- Imputation helps fill those gaps with logical values.  
- Using **Sex** and **Title** makes the imputation more meaningful and closer to real-world data.

---

## 📁 Files Included
- **imputation_assignment.ipynb** — Jupyter Notebook with all code and analysis  
- **README.md** — This documentation file

---

## 📊 Dataset Source  
- Titanic Dataset CSV (Public GitHub / Kaggle source)

---

## 👩‍💻 Tech Used
- Python  
- Pandas  
- NumPy  
- Jupyter Notebook

---

## ✔ Conclusion
This assignment demonstrates how to handle missing values using statistical imputation and feature-based grouping, making the data more reliable for further analysis or machine learning tasks.

