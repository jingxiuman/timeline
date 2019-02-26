# -*- coding: utf-8 -*-
import pymysql
import time
import hashlib
import random

def mysql_connect(dbname='miniapp_migrate_origin'):
	return pymysql.connect(host='localhost', user='root', password='noXf09hmGhnOFsZ!', db=dbname, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

def msgShow(msg):
	print(msg)

def getOriginDate(sql):
	connection=mysql_connect()
	try:
		with connection.cursor() as cursor:
			# Read a single record
			cursor.execute(sql)
			result = cursor.fetchall()
			return result
	finally:
		connection.close()
def migareUserData():
	userArr = getOriginDate("SELECT * FROM `users`")
	newUserArr=[]
	userIdArr={}
	for item in userArr:
		userIdArr[item['openid']] = item['id']
		waitMd5 = 'benbentime'+item['openid'] + str(random.randrange(10000, 99999))
		hash_md5 = hashlib.md5(waitMd5.encode('utf-8'))
		token = hash_md5.hexdigest()
		newUserArr.append((
			item['id'],
			item['openid'],
			token,
			item['username'],
			item['password'],
			'',
			item['user_pic'],
			item['sex'],
			item['province'],
			item['city'],
			item['isWeixin'],
			item['created_at'],
			item['updated_at']
		))
	try:
		connection = mysql_connect('miniapp_migrate_new')
		with connection.cursor() as cursor:
			# Create a new record
			sql = '''
			INSERT INTO `base_users` (`id`, `openid`, `token`, `username`, `password`, `secure_password`, `user_pic`, `sex`, `province`,`city`, `isWeixin`,`created_at`, `updated_at`) 
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
			cursor.executemany(sql, newUserArr)
		connection.commit()
	finally:
		connection.close()
	return userIdArr


def insertBox(boxNewArr):
	try:
		connection = mysql_connect('miniapp_migrate_new')
		with connection.cursor() as cursor:
			# Create a new record
			sql = '''
			INSERT INTO `base_box` (`id`, `user_id`, `eventName`, `eventContent`, `eventTime`, `address`, `idDel`, `eventType`, `isDefault`,`created_at`, `updated_at`) 
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
			cursor.executemany(sql, boxNewArr)
		connection.commit()
	finally:
		connection.close()

def migarateBoxData(userIdArr):
	boxArr = getOriginDate("select * from box")
	boxNewArr =[]
	for item in boxArr:
		boxNewArr.append((
			item['id'],
			userIdArr[item['openid']],
			item['eventName'],
			item['eventContent'],
			item['eventTime'],
			item['address'],
			item['idDel'],
			item['eventType'],
			item['isDefault'],
			item['created_at'],
			item['updated_at']
		))
	insertBox(boxNewArr)

def init():
	userIdArr=migareUserData()
	migarateBoxData(userIdArr)
	pass

if __name__ == "__main__":
	msgShow('start:' + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
	init()
	msgShow('end:' + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
