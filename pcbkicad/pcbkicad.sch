EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L OPL_Connector:DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_ CN3
U 1 1 5FDC47FD
P 8200 4250
F 0 "CN3" H 8328 4292 45  0000 L CNN
F 1 "DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_" H 8328 4208 45  0000 L CNN
F 2 "OPL_Connector:H8-2.54" H 8200 4250 50  0001 C CNN
F 3 "" H 8200 4250 50  0001 C CNN
F 4 "F185-1108A1BSYC1" H 8230 4400 20  0001 C CNN "MPN"
F 5 "320030061" H 8230 4400 20  0001 C CNN "SKU"
	1    8200 4250
	1    0    0    -1  
$EndComp
$Comp
L OPL_Connector:DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_ CN1
U 1 1 5FDC6732
P 2600 4250
F 0 "CN1" H 2492 4804 45  0000 C CNN
F 1 "DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_" H 2492 4720 45  0000 C CNN
F 2 "OPL_Connector:H8-2.54" H 2600 4250 50  0001 C CNN
F 3 "" H 2600 4250 50  0001 C CNN
F 4 "F185-1108A1BSYC1" H 2630 4400 20  0001 C CNN "MPN"
F 5 "320030061" H 2630 4400 20  0001 C CNN "SKU"
	1    2600 4250
	-1   0    0    -1  
$EndComp
Wire Wire Line
	2900 3900 3250 3900
Wire Wire Line
	7400 4400 7900 4400
Wire Wire Line
	7500 4500 7900 4500
Connection ~ 3250 3900
Connection ~ 5450 4200
Wire Wire Line
	7900 4000 5350 4000
Wire Wire Line
	2900 4200 5050 4200
Wire Wire Line
	2900 4400 5150 4400
Wire Wire Line
	2900 4300 4950 4300
NoConn ~ 7900 3900
Wire Wire Line
	7200 5200 7200 3900
Connection ~ 7200 5200
Wire Wire Line
	7400 5200 7400 4400
Connection ~ 7400 5200
Wire Wire Line
	7500 5200 7500 4500
Connection ~ 7500 5200
Wire Wire Line
	7500 5900 7500 5200
Wire Wire Line
	7400 5900 7400 5200
Wire Wire Line
	7200 5900 7200 5200
$Comp
L OPL_Connector:DIP-BLACK-FEMALE-HEADER_2X4P-2.54_ J1
U 1 1 5FDC39B6
P 7350 5550
F 0 "J1" V 7392 5322 45  0000 R CNN
F 1 "DIP-BLACK-FEMALE-HEADER_2X4P-2.54_" V 7308 5322 45  0000 R CNN
F 2 "OPL_Connector:H2X4-2.54" H 7350 5550 50  0001 C CNN
F 3 "" H 7350 5550 50  0001 C CNN
F 4 "320030087" H 7380 5700 20  0001 C CNN "SKU"
	1    7350 5550
	0    -1   -1   0   
$EndComp
Wire Wire Line
	5450 4200 7900 4200
Wire Wire Line
	7300 5200 7300 4100
Wire Wire Line
	7300 4100 7900 4100
Wire Wire Line
	7300 6050 7300 5900
NoConn ~ 7900 4300
Wire Wire Line
	7900 4600 5450 4600
Connection ~ 5450 4600
Wire Wire Line
	5450 4600 5450 4200
NoConn ~ 2900 4600
NoConn ~ 2900 4500
NoConn ~ 2900 4100
NoConn ~ 5850 6350
$Comp
L OPL_Connector:MICRO-USB-SMD-B-_10118193-0001LF_ USB1
U 1 1 5FDD629A
P 3450 6600
F 0 "USB1" V 3517 6272 45  0000 R CNN
F 1 "MICRO-USB-SMD-B-_10118193-0001LF_" V 3433 6272 45  0000 R CNN
F 2 "OPL_Connector:MICRO-USB5+6P-SMD-0.65-B" H 3450 6600 50  0001 C CNN
F 3 "" H 3450 6600 50  0001 C CNN
F 4 "10118193-0001LF" H 3480 6750 20  0001 C CNN "MPN"
F 5 "320010003" H 3480 6750 20  0001 C CNN "SKU"
	1    3450 6600
	0    -1   -1   0   
$EndComp
Wire Wire Line
	3250 3900 3250 6050
Wire Wire Line
	3650 6050 5450 6050
Wire Wire Line
	5450 4600 5450 6050
Connection ~ 5450 6050
Wire Wire Line
	5450 6050 7300 6050
NoConn ~ 3300 7100
NoConn ~ 3400 7100
NoConn ~ 3350 6050
NoConn ~ 3450 6050
NoConn ~ 3550 6050
$Comp
L OPL_Connector:DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_ CN2
U 1 1 5FDE5979
P 5200 2650
F 0 "CN2" V 5134 3078 45  0000 L CNN
F 1 "DIP-BLACK-FEMALE-HEADER-VERT_8P-2.54_" V 5050 3078 45  0000 L CNN
F 2 "OPL_Connector:H8-2.54" H 5200 2650 50  0001 C CNN
F 3 "" H 5200 2650 50  0001 C CNN
F 4 "F185-1108A1BSYC1" H 5230 2800 20  0001 C CNN "MPN"
F 5 "320030061" H 5230 2800 20  0001 C CNN "SKU"
	1    5200 2650
	0    1    -1   0   
$EndComp
Wire Wire Line
	3250 3900 5550 3900
Wire Wire Line
	5550 2950 5550 3900
Connection ~ 5550 3900
Wire Wire Line
	5550 3900 7200 3900
Wire Wire Line
	5450 2900 5450 2950
Connection ~ 5450 2950
Wire Wire Line
	5450 2950 5450 4200
Wire Wire Line
	5350 2950 5350 4000
Wire Wire Line
	5250 2950 5250 4000
Wire Wire Line
	5250 4200 5450 4200
Wire Wire Line
	2900 4000 5250 4000
Connection ~ 5250 4000
Wire Wire Line
	5250 4000 5250 4200
Wire Wire Line
	5150 4400 5150 2950
Wire Wire Line
	5050 4200 5050 2950
Wire Wire Line
	4950 4300 4950 2950
NoConn ~ 4850 2950
$EndSCHEMATC