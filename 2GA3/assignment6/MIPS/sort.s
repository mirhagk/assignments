.data 
.text
.globl main
main:	addi $s0 $s0 0
		li $v0, 10 # system call code for exit = 10
		syscall # call operating sys