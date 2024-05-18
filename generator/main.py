import random

f = open("output.txt", "w")

NO_DIST = 336

temp = 24
moist = 124
people = False
dist = NO_DIST

water_timing = 0
spaying_timing = 0
spray_time = False

for i in range(1000):
  if moist < 100:
    water_timing = 10

  if water_timing > 0:
    water_timing -= 1
    moist += int(random.random() * 5 + 3)
  else:
    moist -= int(random.random() * 5)

  temp += int(random.random() * 2 - 1)
  temp = max(30, min(40, temp))

  people = random.random() > 0.9

  if spaying_timing > 0 :    
    dist += int(random.random() * 25)

  if spaying_timing == 0 and spray_time:
    dist = NO_DIST
    spray_time = False

  if not spray_time:
    dist -= int(random.random() * 25)

  if dist < 50:
    spray_time = True

  if spray_time and not people:
    spaying_timing = 10

  if people:
    spaying_timing = 0


  f.write("MOIST " + str(moist) + "\n")
  f.write("TEMP " + str(temp) + "\n")
  f.write("DIST " + str(dist) + "\n")
  
  if people:
    f.write("PEOPLE true\n")
  else:
    f.write("PEOPLE false\n")

  if water_timing:
    f.write("WATERING true\n")
  else: 
    f.write("WATERING false\n")

  if spaying_timing:
    f.write("SPRAYING true\n")
  else:
    f.write("SPRAYING false\n")

  if spray_time:
    f.write("SPRAY_TIME true\n")
  else:
    f.write("SPRAY_TIME false\n")
    
  f.write("\n")

f.close()
