import cv2
import numpy as np
import face_recognition
import os 
from datetime import datetime
import pandas as pd


def findEncodings(images):
    enCodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodeImg = face_recognition.face_encodings(img)[0]
        enCodeList.append(encodeImg)
        # print(enCodeList)
    return enCodeList