import os
import chromadb
from chromadb.config import Settings
import PyPDF2
from pathlib import Path

# Create persist directory if it doesn't exist
persist_directory = "chroma_db"
if not os.path.exists(persist_directory):
    os.makedirs(persist_directory)

# Initialize ChromaDB with the new configuration
chroma_db = chromadb.PersistentClient(path=persist_directory)

# Function to display menu options
def display_menu():
    print("\n=== ChromaDB Collection Manager ===")
    print("1. View Collections")
    print("2. Add a Collection")
    print("3. Delete a Collection")
    print("4. Insert Files into Collection")
    print("5. User Query")
    print("6. Exit")

# Function to view collections
def view_collections():
    collections = chroma_db.list_collections()
    if not collections:
        print("No collections found.")
    else:
        print("\n\nExisting Collections:")
        for i, collection in enumerate(collections, 1):
            print(f"{i}. {collection.name}")

# Function to add a collection
def add_collection():
    collection_name = input("Enter collection name: ")
    try:
        collection = chroma_db.create_collection(name=collection_name)
        print(f"Collection '{collection_name}' created successfully.")
    except Exception as e:
        print(f"Error creating collection: {str(e)}")

# Function to delete a collection
def delete_collection():
    collections = chroma_db.list_collections()
    if not collections:
        print("No collections to delete.")
        return
    
    print("Available Collections:")
    for i, collection in enumerate(collections, 1):
        print(f"{i}. {collection.name}")
    
    try:
        choice = int(input("Enter the number of the collection to delete: "))
        if 1 <= choice <= len(collections):
            collection_to_delete = collections[choice - 1]
            chroma_db.delete_collection(name=collection_to_delete.name)
            print(f"Collection '{collection_to_delete.name}' deleted successfully.")
        else:
            print("Invalid choice.")
    except ValueError:
        print("Please enter a valid number.")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {str(e)}")
        return None

# Function to insert files into collection
def insert_files():
    collections = chroma_db.list_collections()
    if not collections:
        print("No collections available. Please create a collection first.")
        return
    
    print("Available Collections:")
    for i, collection in enumerate(collections, 1):
        print(f"{i}. {collection.name}")
    
    try:
        choice = int(input("Enter the number of the collection to insert files into: "))
        if not 1 <= choice <= len(collections):
            print("Invalid choice.")
            return
        
        collection = collections[choice - 1]
        folder_path = input("Enter the path to the folder containing PDF files: ")
        
        if not os.path.exists(folder_path):
            print("Folder path does not exist.")
            return
        
        pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
        if not pdf_files:
            print("No PDF files found in the specified folder.")
            return
        
        print(f"Found {len(pdf_files)} PDF files. Processing...")
        
        for pdf_file in pdf_files:
            pdf_path = os.path.join(folder_path, pdf_file)
            text = extract_text_from_pdf(pdf_path)
            
            if text:
                try:
                    # Add the document to the collection
                    collection.add(
                        documents=[text],
                        ids=[pdf_file]
                    )
                    print(f"Successfully added {pdf_file} to collection '{collection.name}'")
                except Exception as e:
                    print(f"Error adding {pdf_file} to collection: {str(e)}")
        
        print("File insertion completed.")
        
    except ValueError:
        print("Please enter a valid number.")

# Function to handle user queries
def user_query():
    collections = chroma_db.list_collections()
    if not collections:
        print("No collections available. Please create a collection first.")
        return
    
    print("Available Collections:")
    for i, collection in enumerate(collections, 1):
        print(f"{i}. {collection.name}")
    
    try:
        choice = int(input("Enter the number of the collection to query: "))
        if not 1 <= choice <= len(collections):
            print("Invalid choice.")
            return
        
        collection = collections[choice - 1]
        query = input("Enter your query: ")
        
        if not query.strip():
            print("Query cannot be empty.")
            return
        
        # Get the number of results to return
        try:
            n_results = int(input("Enter number of results to return (default: 3): ") or "3")
        except ValueError:
            n_results = 3
        
        # Query the collection
        results = collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        print("\n" + "="*80)
        print(f"Query: {query}")
        print(f"Collection: {collection.name}")
        print(f"Number of results: {n_results}")
        print("="*80 + "\n")
        
        if results and results['documents']:
            for i, (doc, score, doc_id) in enumerate(zip(results['documents'][0], 
                                                       results['distances'][0],
                                                       results['ids'][0]), 1):
                print(f"\nResult {i}:")
                print(f"Document: {doc_id}")
                print(f"Relevance Score: {1 - score:.4f}")
                print("-"*40)
                
                # Clean and structure the content
                content = doc.strip()
                
                # Remove common headers/footers
                content = content.replace("Downloaded From: https://perspectives.pubs.asha.org/ by a University College London  User  on 06/19/2018", "")
                content = content.replace("Terms of Use: https://pubs.asha.org/ss/rights_and_permissions.aspx", "")
                
                # Split into sections based on common patterns
                sections = []
                current_section = []
                
                for line in content.split('\n'):
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Check if line starts a new section (e.g., numbered items, headers)
                    if (line[0].isdigit() and '. ' in line) or line.isupper() or line.endswith(':'):
                        if current_section:
                            sections.append('\n'.join(current_section))
                            current_section = []
                    current_section.append(line)
                
                if current_section:
                    sections.append('\n'.join(current_section))
                
                # Print structured content
                for section in sections:
                    if len(section.strip()) > 20:  # Skip very short sections
                        print("\n" + section.strip())
                        print("-"*40)
                
                print("\n" + "="*80)
        else:
            print("No results found.")
            
    except ValueError:
        print("Please enter a valid number.")
    except Exception as e:
        print(f"Error during query: {str(e)}")

# Main function to handle user input
def main():
    while True:
        display_menu()
        choice = input("Enter your choice: ")
        if choice == '1':
            view_collections()
        elif choice == '2':
            add_collection()
        elif choice == '3':
            delete_collection()
        elif choice == '4':
            insert_files()
        elif choice == '5':
            user_query()
        elif choice == '6':
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
