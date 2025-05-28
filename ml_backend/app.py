from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast

app = Flask(__name__)

# Load SBERT and CodeBERT models
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
codebert_model = SentenceTransformer('microsoft/codebert-base')

def tfidf_cosine(text1, text2):
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([text1, text2])
    return cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

def compare_ast(code1, code2):
    try:
        tree1 = ast.parse(code1)
        tree2 = ast.parse(code2)
        return ast.dump(tree1) == ast.dump(tree2)
    except Exception:
        return False

def sbert_similarity(text1, text2):
    emb1 = sbert_model.encode(text1, convert_to_tensor=True)
    emb2 = sbert_model.encode(text2, convert_to_tensor=True)
    return util.pytorch_cos_sim(emb1, emb2).item()

def codebert_similarity(text1, text2):
    emb1 = codebert_model.encode(text1, convert_to_tensor=True)
    emb2 = codebert_model.encode(text2, convert_to_tensor=True)
    return util.pytorch_cos_sim(emb1, emb2).item()

def final_plagiarism_score(text1, text2, is_code=False):
    static = sbert_similarity(text1, text2)
    semantic = codebert_similarity(text1, text2)
    tfidf_score = tfidf_cosine(text1, text2)
    ast_score = compare_ast(text1, text2) if is_code else False
    ast_val = 1.0 if ast_score else 0.0

    if is_code:
        # Note: Here the weights include semantic twice; adjust as needed.
        score = 0.15 * static + 0.25 * semantic + 0.25 * ast_val + 0.20 * semantic + 0.15 * tfidf_score
    else:
        score = 0.25 * static + 0.45 * semantic + 0.30 * tfidf_score

    return {
        "SBERT Similarity": round(static, 4),
        "CodeBERT Similarity": round(semantic, 4),
        "TF-IDF Similarity": round(tfidf_score, 4),
        "AST Match": ast_score if is_code else "N/A",
        "Final Plagiarism Score": round(score, 4)
    }

@app.route('/api/plagiarism', methods=['POST'])
def plagiarism_api():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"error": "Invalid JSON request"}), 400

    text1 = data.get("text1")
    text2 = data.get("text2")
    is_code = data.get("is_code", False)
    if not text1 or not text2:
        return jsonify({"error": "Both 'text1' and 'text2' are required"}), 400

    result = final_plagiarism_score(text1, text2, is_code)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)