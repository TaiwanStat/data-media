# -*- coding: utf-8 -*-

from gensim.models import word2vec
import logging

def main():

    logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
    # To load a model.
    model = word2vec.Word2Vec.load("med250.model.bin")

    sentences = word2vec.Text8Corpus("word2vec_train_data.txt")
    model.train(sentences)

    # Save our model.
    model.save("med250.model.bin")

if __name__ == "__main__":
    main()