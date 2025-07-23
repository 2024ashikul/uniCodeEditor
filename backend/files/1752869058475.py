# Inputs
EnglishLab = float(input())
CSELab = float(input())
ChemistryLab = float(input())
EELab = float(input())
EE = float(input())
CSE = float(input())
DM = float(input())
MATH = float(input())
Chemistry = float(input())

# Credits
credits = {
    'EnglishLab': 1.5,
    'CSELab': 1.5,
    'ChemistryLab': 0.75,
    'EELab': 1.5,
    'EE': 4,
    'CSE': 3,
    'DM': 3,
    'MATH': 3,
    'Chemistry': 3
}

# Weighted Total
Total = (
    EnglishLab * credits['EnglishLab'] +
    CSELab * credits['CSELab'] +
    ChemistryLab * credits['ChemistryLab'] +
    EELab * credits['EELab'] +
    EE * credits['EE'] +
    CSE * credits['CSE'] +
    DM * credits['DM'] +
    MATH * credits['MATH'] +
    Chemistry * credits['Chemistry']
)

# Total Credit
TotalCredits = sum(credits.values())

# Final GPA or Average
Final = Total / TotalCredits
print(round(Final, 2))
