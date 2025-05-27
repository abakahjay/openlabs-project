import json
import random
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Load intents
with open('./chatbot/intents.json') as f:
    intents = json.load(f)

data = []
labels = []

for intent in intents['intents']:
    for pattern in intent['patterns']:
        data.append(pattern)
        labels.append(intent['tag'])

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(data)

model = MultinomialNB()
model.fit(X, labels)

with open("./chatbot/chatbot_model.pkl", "wb") as f:
    pickle.dump((model, vectorizer), f)
