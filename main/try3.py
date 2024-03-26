import argparse
import logging
import os
from collections import defaultdict

import cv2
import torch
import yt_dlp
from mivolo.data.data_reader import InputType, get_all_files, get_input_type
from mivolo.predictor import Predictor
from timm.utils import setup_default_logging
from typing import Dict, List
import socket
import struct
import pickle
import pygame
from queue import Queue
from threading import Thread

import os
import openai
import requests
import sounddevice as sd
import numpy as np
from pydub import AudioSegment
from google.cloud import speech_v1p1beta1 as speech
import io

# Google Cloud 설정
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'tactical-snow-398804-398372ce9df3.json'

# Google STT
def google_stt(audio_data):
    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(content=audio_data)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="ko-KR",
    )
    response = client.recognize(config=config, audio=audio)
    return response.results[0].alternatives[0].transcript

# Naver Clova TTS 설정
def clova_tts(text):
    clova_headers = {
    'X-NCP-APIGW-API-KEY-ID': '166bhnoehc',
    'X-NCP-APIGW-API-KEY': 'AmPA3aVvnEw2ZgKLh1UOgDoQNGg2ZrKeMQMMoOlk',
    }
    clova_api_url = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts'

    response = requests.post(clova_api_url, headers=clova_headers, data={'text': text, 'speaker': 'nara'})
    audio_data = response.content
    return audio_data

# OpenAI GPT-3 설정
api_key = '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'
openai.api_key = api_key
messages = [
    {"role": "system","content": "너는 키오스크 사용이 어려운 어르신들을 위한 예의바르고 친절한 대화형 키오스크야.\
                                와퍼&주니어(대표버거) 카테고리가 있어. 이 안에는 와퍼주니어 단품4700원 세트6700원, 불고기와퍼주니어 단품4700원 세트6700원,치즈와퍼주니어 단품4900원 세트6900원,\
                                와퍼 단품7100원 세트9100원, 불고기와퍼 단품7100원 세트9100원,치즈와퍼 단품7500원 세트9500원,갈릭불고기와퍼 단품7300원 세트9300원,콰트로치즈와퍼주니어 단품5200원 세트7200원,통새우와퍼주니어 단품5200원 세트7200원이있어.\
                                프리미엄 버거 카테고리가 있어. 이 안에는 블랙바비큐콰트로치즈와퍼 단품8500원 세트10300원,블랙바비큐와퍼 단품8200원 세트10000원,몬스터와퍼 단품10200원 세트11500원,몬스터X 단품11000원 세트12300원,통새우와퍼 단품7100원 세트9100원 ,콰트로치즈와퍼 단품6100원 세트8400원이있어.\
                                치킨&슈림프 버거 카테고리가 있어. 이 안에는 치킨킹BLT 단품7500원 세트8800원, 비프&슈림프버거 단품7500원 세트8800원,통새우슈림프버거 단품6900원 세트8200원 ,슈림프버거 단품6900원 세트8200원,통치킨버거 단품6900원 세트8200원,바비큐치킨버거 단품4500원 세트6100원,치킨버거 단품5500원 세트7200원가있어.\
                                스페셜&할인팩 카테고리가 있어. 이 안에는 HELLO DLABLO 팩 1,2,3 가격 19000원이 있고 DIABLO 스페셜팩 가격22000원이 있어.\
                                올데이킹&킹모닝 카테고리가 있어. 이 안에는 더블피브불고기버거세트 단품4900원 세트5600원,더블오리지널치즈버거세트 단품4900원 세트5600원,통새우와퍼주니어세트 단품4900원 세트5600원,콰트로치즈와퍼주니어세트 단품4900원 세트5600원,통치킨버거세트 단품4900원 세트5600원,비프불고기버거 단품4900원 세트5600원,치즈버거 단품4900원 세트5600원이 있어.\
                                사이드 카테고리가 있어. 이 안에는 치즈스틱 2700원, 너겟킹 8조각 5300원, 해쉬브라운 2100원, 너겟킹 5300원, 바삭킹 8조각 9500원, 어니언링 3000원, 쉐이킹프라이 3000원, 치즈프라이 3600원, 코울슬로 2700원, 콘샐러드 2700원\
                                음료&디저트 카테고리가 있어. 이 안에는 망고선데 3100원, 아이스크림 1500원,코카콜라 Regular2600원 Large2800원, 코카콜라제로 Regular2600원 Large2800원, 스프라이트 Regular2600원 Large2800원, 스프라이트제로 Regular2600원 Large2800원, 아메리카노 2200원, 아이스초코 2200원"},

    {"role": "user","content": "불고기"},{"role": "assistant","content": "불고기 와퍼인지 불고기 와퍼주니어인지 물어봐줘\n"},                                
    {"role": "user","content": "불고기와퍼를 주문"},{"role": "assistant","content": "단품으로 주문하시나요 세트로 주문하시나요\n"},
    {"role": "user","content": "세트로 주문해줘"},{"role": "assistant","content": "네 세트로 주문해드릴게요. 사이드와 음료는 어떻게 하시겠어요\n"},
    {"role": "user","content": "아메리카노와 치즈스틱으로 줘"},{"role": "assistant","content": "네 선택하신 조합으로 장바구니에 추가 하겠습니다.\n"},
    {"role": "user","content": "몬스터x버거를 몬터x라고 말하면"},{"role": "assistant","content": " 몬스터가 있는 카테고리로 이동하겠습니다. 몬스터x버거 맞으신가요?\n"},
    {"role": "user","content": "그거 맞아 주문해줘"},{"role": "assistant","content": "네 주문해드리겠습니다. 단품으로 주문하시나요 세트로 주문하시나요\n"},
    {"role": "user","content": "콰치와 주문할게"},{"role": "assistant","content": "콰트로치즈와퍼 맞은신가요? \n"},
    {"role": "user","content": "맞아 주문해줘"},{"role": "assistant","content": "네 콰트로치즈와퍼 주문해드리겠습니다. 단품으로 주문하시나요 세트로 주문하시나요"},
    
    {"role": "user","content": "프렌치프라이로 주문해줘"},{"role": "assistant","content": "네 감자튀김으로 주문해드리겠습니다.\n"},
    {"role": "user","content": "사이드에는 뭐가있어?"},{"role": "assistant","content": "사이드의 종류를 말해주고 선택하면 선택\n"},
    {"role": "user","content": "음료에는 뭐가 있어"},{"role": "assistant","content": "음료의 종류를 말해주고 선택하면 선택 \n"},
    {"role": "user","content": "오랫동안 말을하지 않는다면"},{"role": "assistant","content": "오랫동안 말씀하시지 않으셨어요. 드시고 싶은 메뉴를 말씀해주시거나 화면을 눌러주세요\n"},
    {"role": "user","content": "메뉴들을 단어 2개로 주문 "},{"role": "assistant","content": "말씀하신 n개의 메뉴를 장바구니에 담았습니다. 장바구니에서 메뉴를 눌러 수량이나 세트 구성을 바꾸실 수 있습니다.\n"},
    {"role": "user","content": "만약 와퍼, 콜라, 콰트로치즈와퍼 세트 라고 주문한다면"},{"role": "assistant","content": "말씀하신 n개의 메뉴를 장바구니에 담았습니다. 장바구니에서 메뉴를 눌러 수량이나 세트 구성을 바꾸 실 수 있습니다.\n"},
    {"role": "user","content": "맥모닝으로 주문 해줘"},{"role": "assistant","content": "저희는 올데이킹과 킹모닝이 있습니다. 카테고리로 안내해드리겠습니다.\n"},
    {"role": "user","content": "와퍼 하나 주문해줘"},{"role": "assistant","content": "해당 메뉴를 주문하는 단계를 시작\n"},
    {"role": "user","content": "코카콜라와 스프라이트 같은 사이즈가 있는 메뉴 주문시"},{"role": "assistant","content": "사이즈를 물어봄\n"},
    {"role": "user","content": "치킨,슈림프,콰트로 등 메뉴에 포함되는 특정 재료를 말하면"},{"role": "assistant","content": "해당 메뉴가 있는 카테고리 탭으로 이동하겠습니다\n"},
    {"role": "user","content": "메뉴판에 없는 메뉴가 나온다면"},{"role": "assistant","content": "해당 메뉴는 존재하지 않습니다 다른 메뉴를 주문해주세요\n"},
    {"role": "user","content": "전혀 버거집과 다른 주문을 한다면 예를들어 '장미꽃한송이 주세요' 라고"},{"role": "assistant","content": "주문 내용을 다시 확인해주세요.\n"},
    {"role": "user","content": "메뉴를 주문해서 장바구니에 담을때"},{"role": "assistant","content": "가격도 알려주는 형식\n"},
    {"role": "user","content": "쌀국수 하나 줘"},{"role": "assistant","content": "그런 메뉴는 없습니다., 다시 한번 확인부탁드립니다.\n"},
    #시나리오
    {"role": "user","content": "불고기와퍼 주니어 하나 줘"},{"role": "assistant","content": "네 불고기와퍼주니어를 주문해드리겠습니다. 단품이세요 세트세요"},
    {"role": "user","content": "단품으로 할게"},{"role": "assistant","content": "네 단품으로 주문해드릴게요 가격은 7100원입니다. 결제는 어떻게 하시겠어요"},
    {"role": "user","content": "삼성페이도 될까"},{"role": "assistant","content": "물론이죠! 삼성페이를 카드 단말기 옆에 둬주세요"},
    {"role": "user","content": "세트로 할게"},{"role": "assistant","content": "네 세트로 주문해드릴게요 가격은 9100원입니다. 음료와 사이드는 어떻게 하시나요"},
    {"role": "user","content": "음료는 어떤 종류가 있어?"},{"role": "assistant","content": "코카콜라,스프라이트, 아메리카노, 오렌지 쥬스 등이 있습니다."},
    {"role": "user","content": "제로는 없어?"},{"role": "assistant","content": "건강에 신경쓰시는군요 당연히 제로도 있습니다. 코카콜라 제로로 드릴까요?"},
    {"role": "user","content": "사이드는 어떤 종류가 있어?"},{"role": "assistant","content": "감자튀김, 치킨너겟, 치즈스틱, 해쉬브라운 등이 있습니다."},
    {"role": "user","content": "감자튀김으로 줘"},{"role": "assistant","content": "네 말하신 조합으로 세트를 주문해드릴게요. 더 주문하시겠어요?"},

    {"role": "user","content": "아니야 괜찮아 주문해줘"},{"role": "assistant","content": "네 주문해드리겠습니다. 결제는 어떻게 하시나요?"},
    {"role": "user","content": "콜라로 주문해줘"},{"role": "assistant","content": "콜라는 레귤러로 드릴까요 라지로 드릴까요?"},
    {"role": "user","content": "감자튀김으로 주문해줘"},{"role": "assistant","content": "사이즈는 어떻게 해드릴까요?"},
    {"role": "user","content": "중간사이즈로줘"},{"role": "assistant","content": "레귤러 사이즈로 주문해드릴게요"},

]

_logger = logging.getLogger("inference")
pygame.mixer.init()     # pygame 초기화

def get_parser():
    parser = argparse.ArgumentParser(description="PyTorch MiVOLO Inference")
    return parser

#### client로부터 거리 받기 ####
def receive_data_from_sensor(client_socket, data_queue):
    while True:
        recvData = client_socket.recv(1024)
        dist_data = recvData.decode('utf-8')
        # print("Received distance data:", dist_data)
        data_queue.put(dist_data)

#### '어서오세요' mp3 실행 ####
def play_mp3(mp3_path):
    pygame.mixer.music.load(mp3_path)
    pygame.mixer.music.play()

def main():
    parser = get_parser()
    setup_default_logging()
    args = parser.parse_args()
    
    args.input = "./dataset/messi.jpg"
    args.output = ""
    args.detector_weights = "checkpoints/yolov8x_person_face.pt"
    args.checkpoint = "checkpoints/model_imdb_cross_person_4.22_99.46.pth.tar"
    args.device = "cuda:0"
    args.with_persons = "True"
    args.disable_faces = "False"
    args.draw = "False"

    if torch.cuda.is_available():
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.backends.cudnn.benchmark = True

    predictor = Predictor(args, verbose=True)
    
    #### socket #### 
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host_ip = '141.223.140.77'
    port = 9999
    socket_address = (host_ip, port)
    print('HOST IP:', host_ip)

    server_socket.bind(socket_address)
    server_socket.listen(1)
    print("Listening at:", socket_address)

    # data = b""
    # payload_size = struct.calcsize("Q")
    client_socket, addr = server_socket.accept()
    print('Connection from:', addr)

    data_queue = Queue()
    data_thread = Thread(target=receive_data_from_sensor, args=(client_socket, data_queue))
    data_thread.daemon = True
    data_thread.start()

    #### pc video ####
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        if ret:
            detected_objects, out_im = predictor.recognize(frame)
            

            if detected_objects:    # 객체가 탐지됐다면
                if not data_queue.empty():
                    dist_data = float(data_queue.get())
                    print("Popped distance data:", dist_data)

                    if detected_objects.ages and dist_data < 100:
                        #### audio 추가 ####
                        if not pygame.mixer.music.get_busy():
                            print('Playing MP3...')
                            play_mp3("/home/piai/anaconda3/envs/Kiosk/age_detection/project_nlp/kiosk_1.mp3")

                            first_detected_objects_ages = detected_objects.ages[0]
                            age = int(first_detected_objects_ages // 10)
                            print(age)
                            
                            while True:
                                print("Please say something:")
        
                                # Record audio (for 5 seconds)
                                audio_data = sd.rec(int(5 * 44100), samplerate=44100, channels=2, dtype='int16')
                                sd.wait()
                                audio_data = np.int16(audio_data)
                                audio_data_bytes = AudioSegment(
                                    data=audio_data.tobytes(),
                                    sample_width=audio_data.dtype.itemsize,
                                    frame_rate=44100,
                                    channels=2
                                ).set_channels(1).set_frame_rate(44100).export("temp.wav", format="wav")
                                
                                with io.open("temp.wav", "rb") as audio_file:
                                    content = audio_file.read()
                                
                                # Convert to text
                                try:
                                    text_from_stt = google_stt(content)
                                except:
                                    print("Could not understand audio")
                                    continue
                                
                                print(f"You said: {text_from_stt}")

                                messages.append({'role': 'user', 'content': text_from_stt})
                                
                                # Generate response
                                completion = openai.ChatCompletion.create(
                                    model='gpt-3.5-turbo',
                                    messages=messages,
                                    temperature=1.2,
                                    max_tokens=256,
                                    top_p=0.3,
                                    frequency_penalty=0,
                                    presence_penalty=0
                                )
                                chat_response = completion.choices[0].message.content
                                
                                print(f"Assistant: {chat_response}")

                                messages.append({'role': 'assistant', 'content': chat_response})

                                # Convert response to audio
                                audio_response = clova_tts(chat_response)

                                # Play audio response
                                audio_segment = AudioSegment.from_mp3(io.BytesIO(audio_response))
                                audio_segment.export("response.wav", format="wav")
                                audio_response = AudioSegment.from_wav("response.wav").get_array_of_samples()
                                sd.play(np.array(audio_response).reshape((-1, 1)), 22050)
                                sd.wait()

                        else:
                            pygame.mixer.music.stop()
                        
            if out_im is not None:
                cv2.imshow('Client Video', out_im)
            else:
                cv2.imshow('Client Video', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

if __name__ == "__main__":
    main()