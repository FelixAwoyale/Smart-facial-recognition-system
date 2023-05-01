import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime
import pandas as pd
import dlib


detector = dlib.get_frontal_face_detector()


def findEncodings(images):
    enCodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(img, model='hog')
        # face_locations= detector(img, 1)
        print(face_locations)
        if len(face_locations) == 0:
            # return None if no face is detected
            return None
        encodeImg = face_recognition.face_encodings(img, face_locations)[0]

        # encodeImg = face_recognition.face_encodings(img)[0]
    #     # print(encodeImg)
    #     # enCodeList.append(encodeImg)
    #     # print(enCodeList)
    # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # face_locations = face_recognition.
    return encodeImg


def face_distance(face_encodings, face_to_compare):
    # Reshape the face_to_compare array to have the same shape as face_encodings
    # face_to_compare = np.tile(face_to_compare, (face_encodings.shape[0], 1))
    face_to_compare = np.reshape(face_to_compare, (1, -1))
    # Compute the Euclidean distance between the face encodings
    return np.linalg.norm(face_encodings - face_to_compare, axis=1)
