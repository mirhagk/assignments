.text
j main
#####
# int findMaxIndex(int k, int A[])
#####
#locals:
#	t0 = m
#	t1 = im
#	t2 = i
#	t3 = &(A[i]) (for optimization purposes)
findMaxIndex:
	lw $t0, 0($a1) #int m = A[0]
	ori $t1, $zero, 0 #im = 0
	ori $t2, $zero, 1 #i = 1
	sll $t3, $t2, 2 #t3 = i*4
	add $t3, $t3, $a1 #t3 = A[i]
findMaxIndex_while:
	slt $t4, $t2, $a0 #i < k
	beq $t4, $zero, findMaxIndex_endWhile #while (i<k)
	lw $t4, 0($t3) #load A[i]
	slt $t5, $t4, $t0 #A[i] > m
	beq $t5, $zero, findMaxIndex_if #if (A[i]>m) do this part
	j findMaxIndex_endIf
findMaxIndex_if:
	ori $t0, $t4, 0 #m = A[i]
	ori $t1, $t2, 0 #im = i
findMaxIndex_endIf:
	addi $t2, $t2, 1 #i++
	addi $t3, $t3, 4 #update &(A[i])
	j findMaxIndex_while
findMaxIndex_endWhile:
	li $v0, 4
	la $a0, debugFindMaxIndex
	syscall
	li $v0, 1
	ori $a0, $t1, 0
	syscall
	ori $v0, $t1, 0
	jr $ra
	
#####
# void swap(int i, int j, int A[])
#####
#locals:
#	t0 = h
swap:
	sll $a0, $a0, 2 #i = i*2
	add $a0, $a0, $a2 #a0 holds &(A[i]) now
	sll $a1, $a1, 2 #j = j*2
	add $a1, $a1, $a2 #a1 holds &(A[j]) now
	lw $t0, 0($a0) #h=A[i]
	lw $t1, 0($a1) #load A[j]
	sw $t1, 0($a0) #A[i] = A[j]
	sw $t0, 0($a1) #A[j] = h
	li $v0, 4
	la $a0, debugSwap
	syscall
	li $v0, 1
	ori $a0, $t1, 0
	syscall
	ori $a0, $t0, 0
	syscall
	jr $ra

#####
# void sort(int k, int A[])
#####
#locals:
#	s0 = k/j (just modify k instead of creating new local)
#	s1 = A
#	s2 = im
#	s3 = 1
# *NOTE*: j is optimized away as k can simply be used
sort:
	addi $sp, $sp, -16
	sw $ra, 12($sp)
	sw $s2, 8($sp)
	sw $s1, 4($sp)
	sw $s0, 0($sp)
	ori $s0, $a0, 0
	ori $s1, $a1, 0
	ori $s3, $zero, 1
sort_while:
	beq $s0, $s3, sort_end
	ori $a0, $s0, 0
	ori $a1, $s1, 0
	jal findMaxIndex #findMaxIndex(j,A)
	ori $s2, $v0, 0
	addi $s0, $s0, -1 #j--
	slt $t0, $s2, $s0
	beq $t0, $zero, sort_while
	ori $a0, $s2, 0
	ori $a1, $s0, 0
	ori $a2, $s1, 0
	jal swap
	j sort_while
sort_end:
	lw $ra, 12($sp)
	addi $sp, $sp, 16
	jr $ra
	

.data
k: .word 5
A: .word 2,3,5,4,1
debugSwap: .asciiz "\nSwapping "
debugFindMaxIndex: .asciiz "\nFound max index at"

.text
main:
	lw $a0, k
	la $a1, A
	jal sort
        li $v0, 10  # system call code for exit = 10
        syscall   # call operating sys