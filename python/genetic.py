#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
Developed to find the correct word (simple i know) :)

I simple calc the difference ascii for each one word

goal = raphael
now =  rassaed

goal[1] - now[1] = x

https://miro.medium.com/max/685/0*k7bVZC3sTjw_pdrt.jpg

@author: kieling
'''

import numpy
import random
import matplotlib.pyplot as plt

words = "My mom is baking cookies this afternoon. We could go to my house and eat some. How does that sound?"
definition = [(0, len(words) - 1) for i in range(len(words))]

def generate_word(definition):
    word = ''
    for i in range(len(definition)):
        (min , pos) = definition[i]
        rand_word_position = random.randint(min, pos)
        word = word + words[rand_word_position]
    return word

def coust(word):
    result = 0
    for i in range(len(word)):
        result += abs(ord(words[i]) - ord(word[i]))
    return result

class Mutation:
    def __init__(self, creator_individual, definition,coust_function, words, epochs=200):
        self.population = 100
        self.elitist = 0.3
        self.epochs = epochs
        self.probability_mutate = 0.3
        self.definition = definition
        self.creator_subject= creator_individual
        self.coust_function = coust_function 
        self.words = words
        self.info_x = []
        self.info_y = []
        
    def reproduction(self, subject1, subject2):        
        point = random.randint(self.definition[0][0], self.definition[0][1])
        return subject1[0:point]+subject2[point:]
    
    def mutate(self, subject):
        new_subject = list(subject)
        (min , max) = self.definition[0]
        rand_word_position = random.randint(min, max)
        point = random.randint(0, len(subject) - 1)
        
        new_subject[point] = self.words[rand_word_position]
        return "".join(new_subject)

    def fit(self):
        population  = self.init_population()
        
        for i in range(self.epochs):
            population_coust = [(subject, self.coust_function(subject)) for subject in population]
            population_coust.sort(key=lambda x: x[1])
            population_elite = population_coust[0:(int(self.population * self.elitist))]
            
            self.info_x.append(i)
            self.info_y.append(population_coust[0][1])

            plt.grid()
            axes = plt.gca()
            axes.set_ylim([0, max(mutator.info_y)])
            plt.plot(mutator.info_x,mutator.info_y, color='red',linestyle='dashed', fillstyle='full')
            plt.pause(0.01)
                                        
            while len(population_elite) < self.population - 1:
                subject1 = population_elite[random.randint(0, len(population_elite) - 1)]
                subject2 = population_elite[random.randint(0, len(population_elite) - 1)]
                child = None
                
                if random.random() < self.probability_mutate:
                    child = self.mutate(subject1[0])
                else:
                    child = self.reproduction(subject1[0], subject2[0])
    
                population_elite.append((child, 0 ))

            population = [subject for (subject, coust) in population_elite]
        
        return population[0]
        
    def init_population(self):
        population = []
        for i in range(self.population):
            generated = self.creator_subject(self.definition)
            population.append(generated)
        return population
        
        
mutator = Mutation(
    creator_individual=generate_word, 
    definition=definition,
    coust_function=coust,
    words=words,
    epochs = 300
)

best = mutator.fit()


print(best)
plt.show()
