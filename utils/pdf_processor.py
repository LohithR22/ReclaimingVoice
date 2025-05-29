# File: utils/pdf_processor.py
from PyPDF2 import PdfReader
from pathlib import Path

def process_pdfs(folder_path, collection_name):
    client = chromadb.PersistentClient(path="chroma_db")
    collection = client.get_or_create_collection(collection_name)
    
    pdf_files = [f for f in Path(folder_path).glob("*.pdf")]
    if not pdf_files:
        print("No PDF files found in the specified folder.")
        return
    
    print(f"Found {len(pdf_files)} PDF files. Processing...")
    
    for pdf_file in pdf_files:
        with open(pdf_file, "rb") as f:
            reader = PdfReader(f)
            text = "\n".join([page.extract_text() for page in reader.pages])
            
            # Check if document already exists in the collection
            doc_id = pdf_file.stem  # Use file name (without extension) as unique ID
            existing_docs = collection.query(
                query_texts=[text],
                n_results=1
            )
            
            # Avoid re-adding if it already exists
            if existing_docs and doc_id in existing_docs["ids"]:
                print(f"Document '{doc_id}' already exists. Skipping...")
                continue
            
            # Add new document
            try:
                collection.add(
                    documents=[text],
                    metadatas=[{"source": str(pdf_file.name)}],
                    ids=[doc_id]
                )
                print(f"Successfully added '{pdf_file.name}' to collection '{collection_name}'.")
            except Exception as e:
                print(f"Error adding '{pdf_file.name}': {str(e)}")
