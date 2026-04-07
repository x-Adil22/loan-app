import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Features: Age, Income, Credit_Score, Loan_Amount, Employment_Status (0=Unemployed, 1=Part-time, 2=Full-time, 3=Self-employed), Previous_Defaults (0=No, 1=Yes)
# Create a dummy dataset with realistic-ish correlations
np.random.seed(42)
n_samples = 2000

age = np.random.randint(18, 70, n_samples)
income = np.random.randint(20000, 150000, n_samples)
credit_score = np.random.randint(300, 850, n_samples)
loan_amount = np.random.randint(1000, 50000, n_samples)
employment_status = np.random.choice([0, 1, 2, 3], n_samples, p=[0.1, 0.2, 0.5, 0.2]) 
previous_defaults = np.random.choice([0, 1], n_samples, p=[0.8, 0.2])

# Target variable formulation (higher income, higher credit score -> approve. Higher defaults -> reject)
# Just a dummy function with noise
score = (income / 10000) * 1.5 + (credit_score / 15) - (loan_amount / 2500) - (previous_defaults * 40) + (employment_status * 8)
prob = 1 / (1 + np.exp(-(score - 60) / 15)) # Sigmoid to roughly get 0-1
approved = (prob > np.random.rand(n_samples)).astype(int)

df = pd.DataFrame({
    'Age': age,
    'Income': income,
    'Credit_Score': credit_score,
    'Loan_Amount': loan_amount,
    'Employment_Status': employment_status,
    'Previous_Defaults': previous_defaults,
    'Approved': approved
})

X = df.drop('Approved', axis=1)
y = df['Approved']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=6)
clf.fit(X_train, y_train)

# accuracy
print("Training Accuracy:", clf.score(X_train, y_train))
print("Testing Accuracy:", clf.score(X_test, y_test))

# Save the model
joblib.dump(clf, 'model.pkl')
print("Model created and saved to model.pkl")
