.text
j main
#####
# int findMaxIndex(int k, int A[])
#####
#locals:
#	t0 = m
#	v0 = im (since it's the return value
#	t2 = i
#	t3 = &(A[i]) (for optimization purposes)
findMaxIndex:
	lw $t0, 0($a1) #int m = A[0]
	ori $v0, $zero, 0 #im = 0
	ori $t2, $zero, 1 #i = 1
	sll $t3, $t2, 2 #t3 = i*4
	add $t3, $t3, $a1 #t3 = A[i]
findMaxIndex_while:
	slt $t4, $t2, $a0 #i < k
	beq $t4, $zero, findMaxIndex_endWhile #while (i<k)
	lw $t4, 0($t3) #load A[i]
	slt $t5, $t0, $t4 #A[i] > m, or rather m < A[i]
	beq $t5, $zero, findMaxIndex_endIf #if (A[i]>m) do this part
	ori $t0, $t4, 0 #m = A[i]
	ori $v0, $t2, 0 #im = i
findMaxIndex_endIf:
	addi $t2, $t2, 1 #i++
	addi $t3, $t3, 4 #update &(A[i])
	j findMaxIndex_while
findMaxIndex_endWhile:
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
	jr $ra

#####
# void sort(int k, int A[])
#####
#locals:
#	s0 = j (just modify k instead of creating new local)
#	s1 = A
#	v0 = im (the return register is used after the call to findMaxIndex
#		this is possible since we don't need to preserve it's value across the loop iterations, ie across any function calls)
#	s3 = 1
# *NOTE*: k is not saved, since it's not needed after being assigned to j
sort:
	addi $sp, $sp, -12
	sw $ra, 8($sp)
	sw $s1, 4($sp)
	sw $s0, 0($sp)
	ori $s0, $a0, 0
	ori $s1, $a1, 0
sort_while:
	ori $t0, $zero, 1
	slt $t0, $t0, $s0 #j>1
	beq $t0, $zero, sort_end #if not exit while loop
	ori $a0, $s0, 0 #prep function call, j is first argument
	ori $a1, $s1, 0 #prep function call, A is second argument
	jal findMaxIndex #findMaxIndex(j,A)
	addi $s0, $s0, -1 #j--
	slt $t0, $v0, $s0 #im < j
	beq $t0, $zero, sort_while #if not go back to top of loop
	ori $a0, $v0, 0
	ori $a1, $s0, 0
	ori $a2, $s1, 0
	jal swap
	j sort_while
sort_end:
	lw $ra, 8($sp)
	lw $s1, 4($sp)
	lw $s0, 0($sp)
	addi $sp, $sp, 12
	jr $ra

	
#####
# OutArray(int k,int A[]), requires k>0
#####
# Outputs an array
outArray:
	ori $t0, $a0, 0
outArray_loop:
	beq $t0, $zero, outArray_end
	li $v0, 1
	lw $a0, 0($a1)
	syscall
	li $v0, 11
	li $a0, ' '
	syscall
	addi $a1, $a1, 4
	addi $t0, $t0, -1
	j outArray_loop
outArray_end:
	li $v0, 11
	li $a0, '\n'
	syscall
	jr $ra
	

.data
k: .word 10
A: .word 2,3,5,4,1,9,7,8,6,0

.text
main: #doesn't need to save variables since it's main
	lw $s0, k
	la $s1, A
	ori $a0, $s0, 0
	ori $a1, $s1, 0
	jal outArray
	
	ori $a0, $s0, 0
	ori $a1, $s1, 0
	jal sort
	
	ori $a0, $s0, 0
	ori $a1, $s1, 0
	jal outArray
	
        li $v0, 10  # system call code for exit = 10
        syscall   # call operating sys