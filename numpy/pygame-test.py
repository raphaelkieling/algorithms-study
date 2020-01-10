import pygame
import numpy as np

pygame.init()
clock = pygame.time.Clock()
start_ticks = pygame.time.get_ticks()
screen = pygame.display.set_mode((300,300))

class Wall:
    def __init__(self,i,j,s):
        self.surface = pygame.Surface((s,s))
        self.i = i
        self.s = s
        self.j = j
    
    def draw(self):
        self.surface.fill((255,255,0))
        screen.blit(self.surface, (self.i * self.s,self.j* self.s))
        
class Ball:
    def __init__(self,i,j,s):
        self.surface = pygame.Surface((s,s))
        self.i = i
        self.j = j
        self.s = s
    
    def draw(self):
        self.surface.fill((255,0,0))
        screen.blit(self.surface, (self.i * self.s,self.j* self.s))

class Bomb:
    def __init__(self,i,j,s):
        self.surface = pygame.Surface((s,s))
        self.i = i
        self.j = j
        self.s = s
    
    def draw(self):
        self.surface.fill((0,255,0))
        screen.blit(self.surface, (self.i * self.s,self.j* self.s))

map = np.zeros((10,10,2), dtype=Wall)

s = 600 / len(map) 

for i in range(len(map)):
    for j in range(len(map[i])):
        map[i][j][0] = Wall(i,j,s)
        

ball = Ball(1,1,s)
bomb = Bomb(1, 3,s)
        

while True:
    clock.tick(30)
    screen.fill((0,0,0))
    
    events = pygame.event.get()
    for event in events:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                ball.i -= 1
            if event.key == pygame.K_RIGHT:
                ball.i +=1
            if event.key == pygame.K_UP:
                ball.j -=1
            if event.key == pygame.K_DOWN:
                ball.j +=1
 
    
    
    map[ball.i, ball.j, 1] = ball
    map[bomb.i, bomb.j, 0] = bomb
    
    print(map[ball.i, ball.j, 0])
    
    
    for i in range(len(map)):
        for j in range(len(map[i])):
            for m in range(len(map[i][j])):
                obj = map[i][j][m]
                if obj:
                    obj.draw()

    
    pygame.display.update()